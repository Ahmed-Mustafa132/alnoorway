import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function RatingWidget({ contentType, contentId }) {
  const [user, setUser] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ ...authUser, role: 'user' });
      }
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const { data: ratings } = useQuery({
    queryKey: ['ratings', contentType, contentId],
    queryFn: async () => {
      const { data, error } = await supabase.from('Rating').select('*').eq('content_type', contentType).eq('content_id', contentId);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: userRating } = useQuery({
    queryKey: ['user_rating', contentType, contentId, user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase.from('Rating').select('*').eq('content_type', contentType).eq('content_id', contentId).eq('user_email', user.email);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    initialData: [],
  });

  const addRatingMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('Rating').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', contentType, contentId] });
      queryClient.invalidateQueries({ queryKey: ['user_rating', contentType, contentId, user?.email] });
      setShowReviewForm(false);
      setReview("");
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await supabase.from('Rating').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', contentType, contentId] });
      queryClient.invalidateQueries({ queryKey: ['user_rating', contentType, contentId, user?.email] });
      setShowReviewForm(false);
      setReview("");
    },
  });

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  const existingRating = userRating?.[0];

  const handleRatingClick = (rating) => {
    if (!user) {
      alert("يرجى تسجيل الدخول للتقييم");
      return;
    }
    setSelectedRating(rating);
    setShowReviewForm(true);
  };

  const handleSubmit = () => {
    if (!user || selectedRating === 0) return;

    const ratingData = {
      user_email: user.email,
      content_type: contentType,
      content_id: contentId,
      rating: selectedRating,
      review: review
    };

    if (existingRating) {
      updateRatingMutation.mutate({ id: existingRating.id, data: ratingData });
    } else {
      addRatingMutation.mutate(ratingData);
    }
  };

  useEffect(() => {
    if (existingRating) {
      setSelectedRating(existingRating.rating);
      setReview(existingRating.review || "");
    }
  }, [existingRating]);

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                    star <= (hoveredRating || averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRatingClick(star)}
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {averageRating > 0 ? (
              <>
                <span className="font-bold text-2xl text-amber-600">{averageRating.toFixed(1)}</span>
                <span className="mx-2">من 5</span>
                <span className="text-gray-500">({ratings.length} تقييم)</span>
              </>
            ) : (
              <span>كن أول من يقيّم!</span>
            )}
          </div>
          {existingRating && (
            <p className="text-sm text-blue-600 mt-2">تقييمك: {existingRating.rating} نجوم</p>
          )}
        </div>

        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Textarea
              placeholder="أضف مراجعة (اختياري)..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowReviewForm(false);
                  setSelectedRating(existingRating?.rating || 0);
                  setReview(existingRating?.review || "");
                }}
              >
                إلغاء
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={addRatingMutation.isPending || updateRatingMutation.isPending}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                {addRatingMutation.isPending || updateRatingMutation.isPending ? "جاري الحفظ..." : "حفظ التقييم"}
              </Button>
            </div>
          </motion.div>
        )}

        {/* عرض المراجعات */}
        {ratings.filter(r => r.review).length > 0 && (
          <div className="mt-6 pt-6 border-t space-y-4">
            <h4 className="font-bold text-gray-900">المراجعات:</h4>
            {ratings.filter(r => r.review).slice(0, 3).map((rating) => (
              <div key={rating.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rating.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{rating.review}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}