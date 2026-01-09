import { Avatar as ArkAvatar } from "@ark-ui/solid/avatar";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

type AvatarProps = { email: string };
export const Avatar = (props: AvatarProps) => {
  const avatar = createAvatar(openPeeps, {
    seed: props.email,
  });

  return (
    <ArkAvatar.Root>
      <ArkAvatar.Image src={avatar.toDataUri()} />
    </ArkAvatar.Root>
  );

  // return (
  //   <picture class="inline-block size-full overflow-hidden rounded-full">
  //     <img src={avatar.toDataUri()} />
  //   </picture>
  // );
};
