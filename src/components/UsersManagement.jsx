import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Shield, Ban, CheckCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function UsersManagement() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin_users_manage'],
    queryFn: async () => {
      const { data, error } = await supabase.from('User').select('*').order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      // Call backend function for secure update
      const { data, error } = await supabase.functions.invoke('adminUsers', {
        body: { action: 'update_role', userId, role }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users_manage'] });
      toast.success("تم تحديث الصلاحية بنجاح");
    },
    onError: (error) => toast.error("فشل التحديث: " + error.message)
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ userId, isActive }) => {
      const { data, error } = await supabase.functions.invoke('adminUsers', {
        body: { action: 'toggle_active', userId, isActive }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users_manage'] });
      toast.success("تم تحديث حالة الحساب");
    },
    onError: (error) => toast.error("فشل التحديث: " + error.message)
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email }) => {
      const { data, error } = await supabase.functions.invoke('adminUsers', {
        body: { action: 'reset_password', email }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("تم إرسال تعليمات استعادة كلمة المرور");
    },
    onError: (error) => toast.error("فشل الإرسال: " + error.message)
  });

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Search className="w-5 h-5 text-gray-400" />
        <Input 
          placeholder="بحث بالاسم أو البريد الإلكتروني..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 focus-visible:ring-0"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الصلاحية</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium text-gray-900">{user.full_name || 'مستخدم'}</div>
                  <div className="text-xs text-gray-500">منذ {new Date(user.created_date).toLocaleDateString('ar-SA')}</div>
                </TableCell>
                <TableCell className="text-gray-600 font-mono text-sm">{user.email}</TableCell>
                <TableCell>
                  <Select 
                    defaultValue={user.role || 'user'} 
                    onValueChange={(val) => updateRoleMutation.mutate({ userId: user.id, role: val })}
                  >
                    <SelectTrigger className="w-[130px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">مستخدم</SelectItem>
                      <SelectItem value="moderator">مشرف</SelectItem>
                      <SelectItem value="admin">مدير</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                     <Switch 
                        checked={user.is_active !== false} 
                        onCheckedChange={(checked) => toggleActiveMutation.mutate({ userId: user.id, isActive: checked })}
                     />
                     <span className={`text-xs font-medium ${user.is_active !== false ? 'text-green-600' : 'text-red-600'}`}>
                        {user.is_active !== false ? 'نشط' : 'معطل'}
                     </span>
                   </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if(confirm("إعادة تعيين كلمة المرور لهذا المستخدم؟")) {
                            resetPasswordMutation.mutate({ email: user.email });
                        }
                    }}
                    className="text-gray-500 hover:text-blue-600"
                    title="إعادة تعيين كلمة المرور"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">لا توجد نتائج</div>
        )}
      </div>
    </div>
  );
}