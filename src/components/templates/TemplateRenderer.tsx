import React, { useState } from 'react';
import { CreatorAccount, GalleryItem, Post, SocialLink } from '../../types/creator';
import { EditorialLuxuryTemplate } from './EditorialLuxuryTemplate';
import { DarkCreatorTemplate } from './DarkCreatorTemplate';
import { MinimalPersonalTemplate } from './MinimalPersonalTemplate';
import { InteractiveLetterModal } from '../public/InteractiveLetterModal';
import { PostReaderModal } from '../public/PostReaderModal';
import { GalleryLightboxModal } from '../public/GalleryLightboxModal';
import { ShareModal } from '../public/ShareModal';
import { recordLinkClick, recordLetterOpen } from '../../services/storageService';

interface TemplateRendererProps {
  account: CreatorAccount;
  isPreview?: boolean;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ account, isPreview = false }) => {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [activeGalleryItem, setActiveGalleryItem] = useState<GalleryItem | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleOpenLetter = () => {
    setIsLetterOpen(true);
  };

  const handleLetterOpened = () => {
    if (!isPreview) {
      recordLetterOpen(account.profile.username);
    }
  };

  const handleLinkClick = (link: SocialLink) => {
    if (!isPreview) {
      recordLinkClick(account.profile.username, link.id);
    }
  };

  const templateProps = {
    account,
    isPreview,
    onOpenLetter: handleOpenLetter,
    onOpenPost: (post: Post) => setActivePost(post),
    onOpenGalleryItem: (item: GalleryItem) => setActiveGalleryItem(item),
    onLinkClick: handleLinkClick,
    onShare: () => setIsShareOpen(true),
  };

  const renderTemplate = () => {
    switch (account.design.templateId) {
      case 'dark-creator':
        return <DarkCreatorTemplate {...templateProps} />;
      case 'minimal-personal':
        return <MinimalPersonalTemplate {...templateProps} />;
      case 'editorial-luxury':
      default:
        return <EditorialLuxuryTemplate {...templateProps} />;
    }
  };

  return (
    <>
      {renderTemplate()}

      {/* Fan Letter Modal */}
      <InteractiveLetterModal
        letter={account.letter}
        creatorName={account.profile.displayName}
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
        onOpened={handleLetterOpened}
      />

      {/* Post Reader Modal */}
      <PostReaderModal
        post={activePost}
        creatorName={account.profile.displayName}
        onClose={() => setActivePost(null)}
        onShare={() => setIsShareOpen(true)}
      />

      {/* Gallery Lightbox */}
      <GalleryLightboxModal
        item={activeGalleryItem}
        items={account.gallery || []}
        isOpen={!!activeGalleryItem}
        onClose={() => setActiveGalleryItem(null)}
        onSelect={(item) => setActiveGalleryItem(item)}
      />

      {/* Share Modal */}
      <ShareModal
        account={account}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </>
  );
};
