
export const SampleTemplates = [
  {
    "template_name" : "LinkedIn profiles",
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
            "xPath" : "//div/div[2]/div/div/main/*/div[3]/div/div/div/span",
        }
    ],
    "icon" : "https://static-exp1.licdn.com/sc/h/akt4ae504epesldzj74dzred8",
    "primaryField" : "Name",
    "secondaryField" : "Position",
    "entryLogo" : "Photo",
  }
];
