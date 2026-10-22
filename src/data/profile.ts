export type ExternalProfileLinkType = "qq" | "music" | "github"
export type ProfileLinkType = ExternalProfileLinkType | "wechat"

export interface ExternalProfileLink {
  type: ExternalProfileLinkType
  name: string
  url: string
}

export interface QrProfileLink {
  type: "wechat"
  name: string
  qrImage: string
  qrAlt: string
  label: string
}

export type ProfileLink = ExternalProfileLink | QrProfileLink

export const profile: {
  name: string
  bio: string
  avatar: string
  links: ProfileLink[]
} = {
  name: "Zak",
  bio: "记录、思考与折腾",
  avatar: "/avatar.webp",
  links: [
    {
      type: "github",
      name: "GitHub",
      url: "https://github.com/moment6580",
    },
  ],
}
