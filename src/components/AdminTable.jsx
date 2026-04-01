import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminFormModal from "./AdminFormModal";

export default function AdminTable({ entity, fields, showPendingOnly }) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: [entity, showPendingOnly],
    queryFn: async () => {
      let query = supabase.from(entity).select('*').order('created_date', { ascending: false });
      if (showPendingOnly) {
        query = query.eq('is_approved', false);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from(entity).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entity, showPendingOnly] });
    },
  });

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <div>
      <div className="mb-6">
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة جديد
        </Button>
      </div>

      {showPendingOnly && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800">
            <span className="font-semibold">{items.length}</span> تعليق في انتظار الموافقة
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      ) : items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {fields.slice(0, 3).map((field) => (
                  <th key={field.key} className="text-right py-3 px-4 font-semibold text-gray-700">
                    {field.label}
                  </th>
                ))}
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {fields.slice(0, 3).map((field) => (
                    <td key={field.key} className="py-3 px-4">
                      {typeof item[field.key] === 'boolean'
                        ? (item[field.key] ? 'نعم' : 'لا')
                        : (String(item[field.key] || '-').slice(0, 100))}
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          لا توجد بيانات
        </div>
      )}

      {showModal && (
        <AdminFormModal
          entity={entity}
          fields={fields}
          item={editingItem}
          open={showModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}