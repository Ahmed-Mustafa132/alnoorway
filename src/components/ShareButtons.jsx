import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Twitter, Facebook, Link2, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ShareButtons({ title, url, description }) {
  const shareUrl = url || window.location.href;
  const shareText = `${title}${description ? ' - ' + description : ''}`;

  const handleShare = (platform) => {
    let shareLink = '';
    
    switch(platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('تم نسخ الرابط!');
        return;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          مشاركة
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          <MessageCircle className="w-4 h-4 ml-2 text-green-600" />
          واتساب
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="w-4 h-4 ml-2 text-blue-400" />
          تويتر (X)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="w-4 h-4 ml-2 text-blue-600" />
          فيسبوك
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('telegram')}>
          <MessageCircle className="w-4 h-4 ml-2 text-blue-500" />
          تيليجرام
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('copy')}>
          <Copy className="w-4 h-4 ml-2" />
          نسخ الرابط
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}