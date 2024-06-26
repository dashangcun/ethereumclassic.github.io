import React from "react";
import tw from "twin.macro";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { useGlobals } from "../../plugins/translations-plugin/src/components/localizationProvider";

import * as appColors from "./appsColors";
import Modal from "./modal";
import Icon from "./icon";
import AppsItemModal from "./appsItemModal";

function AppIcon({ image, title, icon, iconCol, big }) {
  if (image) {
    return (
      <GatsbyImage
        image={getImage(image)}
        alt={title}
        css={[tw`h-20 w-20 bg-white rounded-lg`, big && tw`sm:w-52 sm:h-52`]}
      />
    );
  }
  return (
    <div
      css={[
        tw`h-20 w-20 overflow-hidden rounded-lg flex items-center justify-center`,
        iconCol,
        big && tw`sm:w-52 sm:h-52`,
      ]}
    >
      <Icon
        icon={icon || "etc"}
        css={[tw`w-14 h-14 rotate-12`, big && tw`sm:w-32 sm:h-32`]}
      />
    </div>
  );
}

export default function AppsItem({
  item,
  monochrome,
  showType = true,
  hash = true,
  ...rest
}) {
  const {
    ui: { appTypes },
  } = useGlobals();
  const { title, slug, image, type, author } = item;
  const appType = appTypes[type];
  const trueCol = appColors[appType.color] || appColors.default;
  const col = monochrome ? appColors.gray : trueCol;
  return (
    <Modal
      slug={hash && slug}
      content={<AppsItemModal {...{ item, appType, trueCol }} />}
      {...rest}
    >
      <div
        className="group"
        css={[
          tw`h-20 relative cursor-pointer shadow-sm rounded-lg border border-shade-lightest overflow-hidden`,
          col.fg,
        ]}
      >
        <div css={[tw`absolute inset-0 dark:opacity-30`, col.bg]} />
        <div tw="relative z-10">
          <AppIcon
            image={image}
            title={title}
            icon={appType.icon}
            iconCol={trueCol.icon}
          />
          <div tw="absolute inset-0 left-20 px-4 flex items-center">
            <div tw="w-full">
              <div tw="font-bold line-clamp-2 leading-tight">{title}</div>
              <div tw="whitespace-nowrap opacity-60 overflow-hidden overflow-ellipsis text-sm">
                {showType ? appType.name : author}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
