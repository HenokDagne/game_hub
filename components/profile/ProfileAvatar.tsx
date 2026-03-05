import Image from "next/image";

type ProfileAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-10 w-10 text-xs",
  md: "h-16 w-16 text-sm",
  lg: "h-24 w-24 text-lg",
};

export default function ProfileAvatar({ name, imageUrl, size = "md" }: ProfileAvatarProps) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "P";

  const normalizedImage = imageUrl && imageUrl.startsWith("/") ? imageUrl : null;

  return (
    <div
      aria-label={`${name} avatar`}
      className={`relative rounded-full p-[2px] ${sizeClasses[size]}`}
      style={{
        background:
          "conic-gradient(from 210deg, #facc15 0deg, #f97316 72deg, #ec4899 144deg, #a855f7 216deg, #3b82f6 288deg, #facc15 360deg)",
      }}
    >
      <div className="h-full w-full rounded-full bg-black/5 p-[2px]">
        <div className="profile-border relative h-full w-full overflow-hidden rounded-full border bg-black/5">
          {normalizedImage ? (
            <Image alt={`${name} avatar`} className="object-cover" fill sizes="96px" src={normalizedImage} />
          ) : (
            <div className="profile-strong-text flex h-full w-full items-center justify-center font-semibold">{initials}</div>
          )}
        </div>
      </div>
    </div>
  );
}
