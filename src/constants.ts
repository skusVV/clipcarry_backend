export const TOKEN_KEY = 'here_is_my_token';
export const EXPIRATION_TIME = '365d';
export const DEFAULT_USER_EXPIRATION_TIME = '365d';

export const SampleTemplates = [
  {
    "template_name" : "LinkedIn",
    "isSample" : true,
    "isSampleDraft": true,
    "fields" : [
        {
            "name" : "Name",
            "fieldType" : "Short Field",
            "xPath" : "//div[2]/div/div/main/section[1]/div[2]/div[2]/div[1]/div[1]/h1",
        },
        {
            "name" : "Position",
            "fieldType" : "Short Field",
            "xPath" : "//div/div[2]/div/div/main/section[1]/div[2]/div[2]/div[1]/div[2]",
        },
        {
            "name" : "Photo",
            "fieldType" : "Image",
            "xPath" : "//div/div/main/section[1]/div[2]/div[1]/div[1]/div/div/button",
        },
        {
            "name" : "About",
            "fieldType" : "Long Field",
            "xPath" : "//div[2]/div/div/main/section[5]/div[3]/div/div/div/span[1]",
        }
    ],
    "icon" : "https://static-exp1.licdn.com/sc/h/akt4ae504epesldzj74dzred8",
    "primaryField" : "Name",
    "secondaryField" : "Position",
    "entryLogo" : "Photo",
  }
];