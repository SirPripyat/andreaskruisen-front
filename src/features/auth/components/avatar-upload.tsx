import { CameraIcon, Loader2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getInitials } from '@/lib';
import { useAvatar, useUploadAvatar } from '../hooks';

type AvatarUploadProps = {
  name: string;
};

export const AvatarUpload = ({ name }: AvatarUploadProps) => {
  const { url: avatarUrl } = useAvatar();
  const { mutate: uploadAvatar, isPending } = useUploadAvatar();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    uploadAvatar(file, {
      onError: () => {
        setPreviewUrl(null);
        if (inputRef.current) inputRef.current.value = '';
      },
    });
  };

  const src = previewUrl ?? avatarUrl ?? undefined;

  return (
    <div className={'relative inline-flex'}>
      <Avatar className={'size-24'}>
        {src && <AvatarImage src={src} alt={name} />}
        <AvatarFallback className={'text-2xl'}>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {isPending && (
        <div
          className={
            'absolute inset-0 flex items-center justify-center rounded-full bg-background/60'
          }
        >
          <Loader2Icon className={'size-6 animate-spin'} />
        </div>
      )}

      <label
        htmlFor={'profile-avatar'}
        className={
          'absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background hover:bg-primary/90'
        }
      >
        <CameraIcon className={'size-4'} />
        <span className={'sr-only'}>Alterar foto de perfil</span>
      </label>

      <input
        ref={inputRef}
        id={'profile-avatar'}
        type={'file'}
        accept={'image/jpeg,image/png,image/webp'}
        className={'sr-only'}
        disabled={isPending}
        onChange={(event) => handleFileChange(event.target.files?.[0])}
      />
    </div>
  );
};
