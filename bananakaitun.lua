repeat wait() until game:IsLoaded() and game.Players.LocalPlayer 
getgenv().Key = "cedcbeba78ef4337731444a0"
getgenv().__BANANA_SCRIPT_ROUTE = "kaitunbf"
Config = {
    Team = "Pirates",
    FastTween = true,
    AutoHop = true,
    HopWhenIdle = true,
    FpsBoost = true,
    FpsCap = 25,
    BlockAcc = false,
    BlackScreen = false,
    FarmBoneForx2EXP = false,
    WebhookEnabled = false,
    WebhookUrl = "",
    WebhookIntervalMinutes = 5,
    GetItems = {
        Sword = {
            ["Saber"] = true,
            ["Gravity Blade"] = true,
            ["Rengoku"] = true,
            ["Soul Cane"] = true,
            ["Bisento"] = true,
            ["Midnight Blade"] = true,
            ["Buddy Sword"] = true,
            ["Spikey Trident"] = true,
            ["Hallow Scythe"] = true,
            ["Cursed Dual Katana"] = true
        },
        Gun = {
            ["Serpent Bow"] = true,
            ["Skull Guitar"] = true
        },
        Accessory = {
            ["Ghoul Mask"] = true,
            ["Pilot Helmet"] = true,
            ["Lei"] = true
        },
        Race = {
            ["Race V2"] = true
        }
    },
    BuyHaki = {
        ["Enhancement"] = true,
        ["Skyjump"] = true,
        ["Flash Step"] = true,
        ["Observation"] = true
    }
}
return loadstring(game:HttpGet("https://banana-hub.xyz/loader/banana.lua"))()