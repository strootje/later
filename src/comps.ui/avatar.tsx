import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

type AvatarProps = { email: string };
export const Avatar = (props: AvatarProps) => {
  const avatar = createAvatar(openPeeps, {
    seed: props.email,
  });

  return (
    <picture class="inline-block size-full overflow-hidden rounded-full">
      <img src={avatar.toDataUri()} />
    </picture>
  );
};
