/*
    ioBroker.vis vis-2-widgets-sigenergy — Widget-Set
    4 Widgets: Energiefluss · Akku-Status · Echtzeit-Leistung · Statistiken

    version: "1.6.9"
    Copyright 2026 ssbingo s.sternitzke@online.de
*/
"use strict";


/* global $, vis, systemDictionary */

// add translations for edit mode
if (typeof systemDictionary !== "undefined") {
    $.extend(
        true,
        systemDictionary,
        {
        "sig_title":    { "en": "Title",             "de": "Titel" },
        "sig_darkmode": { "en": "Dark mode",         "de": "Dunkelmodus" },
        "sig_animation":{ "en": "Animation",         "de": "Animation" },
        "oid_pv":       { "en": "PV Power OID",      "de": "PV-Leistung OID" },
        "oid_bat":      { "en": "Battery Power OID", "de": "Batterie-Leistung OID" },
        "oid_grid":     { "en": "Grid Power OID",    "de": "Netz-Leistung OID" },
        "oid_house":    { "en": "House Power OID",   "de": "Haus-Leistung OID" },
        "oid_soc":      { "en": "Battery SOC OID",   "de": "Batterie SOC OID" },
        "oid_soh":      { "en": "Battery SOH OID",   "de": "Batterie SOH OID" },
        "oid_ttf":      { "en": "Time to Full OID",  "de": "Zeit bis Voll OID" },
        "oid_ttr":      { "en": "Time Remaining OID","de": "Restlaufzeit OID" },
        "oid_sc":       { "en": "Self Consumption OID","de": "Eigenverbrauch OID" },
        "oid_aut":      { "en": "Autarky Rate OID",  "de": "Autarkierate OID" },
        "oid_maxsoc":   { "en": "Day Max SOC OID",   "de": "Tages Max SOC OID" },
        "oid_minsoc":   { "en": "Day Min SOC OID",   "de": "Tages Min SOC OID" },
        "oid_charg":    { "en": "Daily Charge OID",  "de": "Tages-Ladung OID" },
        "oid_discharg": { "en": "Daily Discharge OID","de": "Tages-Entladung OID" },
        "oid_covtime":  { "en": "Battery Coverage OID","de": "Batteriedeckung OID" },
        "oid_chargt":   { "en": "Daily Charge Time OID","de": "Tages-Ladezeit OID" },
        "oid_pv1":      { "en": "PV String 1 Power OID",  "de": "PV String 1 Leistung OID" },
        "oid_pv2":      { "en": "PV String 2 Power OID",  "de": "PV String 2 Leistung OID" },
        "oid_pv3":      { "en": "PV String 3 Power OID",  "de": "PV String 3 Leistung OID" },
        "oid_pvtotal":  { "en": "Total PV Power OID",     "de": "PV Gesamtleistung OID" }
        }
    );
}

vis.binds["vis-2-widgets-sigenergy"] = {
    version: "1.6.9",

    /* Bilder als base64-Data-URI — kein Serverpfad, kein Upload nötig */
    _PVS_SOLAR:  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAABBCAYAAAAdf3znAAA6VklEQVR42u29eZSlV1nv/9n7nc48n5qrO+kOmRgTiF6USRcogyIq3QEUEbl6RbxeQb0RUTtBIEENqMioSYCAQFoZ4r0qujSEYCCEDAQCSTqkp5rPPL7z3r8/3nOKkyZBQoLG+/OsVauqTp3p3fv7TN/n++wSPApvhw4dkpdccokCuP32zewTn7gQSikDjQb9iL6VSL4dkM985o64/5+exdzc1x7w3c4999zd+y+++GIthEBrjRBC85/0Jh5tH+jAgQPG4cOH45e85CXzZ5/9pCtvv+3W02IlPd8NtpeWlsTIHbR9z+uWymWrVqn2G43t7Vwhb9rZTNMbjJu1WtFWKm52u73umY8906zWCl5jfdRcLBb14v7F/smTgX7Oc57A4uLiCEBKiVLqEVxPDQhx4MCBB1nbA5Pvhx9VwBKPRhD88m/88txjlp7wd5/85Cee/IUbb8Y0U5SKJdAC13NxHItarYYfevi+h2kalIs1RuMhmhhDpqjP1wjDAKVjpJCDaqWqOt1GwzRNZdtpcrl8YzQaRqVSXoZhtJPPF3qplGX6vr85Go2Gy8urMvLj46NRP1zZu8qJjfW11dU90b6lRTnyvSYIf2GhZAC9eh33Wc86oIUQo+/RHmlAHjp0iEsugQMHviZm1ow777xTAHzta9/0YOeee66eetX/VEA4dOiQfOMb36gWFhYyv/7rv/33//f//PMzPnvDp8NCrmZkM1mUivVwOEBrQbFY0mEU0O/3EUiRz+cJQh/XdYVWUCpXhO+5wh2PtUaKUrlEGAT4gYfWmnK5gmXaDAZ9hBDk8zlSqTTDUR8hBYZhsby0TKPRwhASLxzxAz/4VIqlInd+5XYMw/YVOlhcWJXdfrcbBaGby2a1bZmNfLEoA2/cQdJMOxm7WC53u932VqmUtyJFo9/tt1dXFy3TdLa1YfcydtqAUVMII6jXa8bcXKmbz/vDMNTGs571op4QQhuGJI7V//se4dChQ/Liiy/WBw8ezD7lKU/7xL/882ef/el//IeolC+Z6XQGhGA4HIAWlEpFojhmOBwghSSXyxNGAZ7roTUUCkViFTEeD9FKkC8U0CrSo7FLHCldKBSwHZNGo6kFAtO0yeeztNotiAUaxfzCAt1uB8/zCSKf1dUFfvRHnyc/+MGricIIgSEKhQICk8GwjzRMpBDs2btCp9shDCNMU5BKpchlCgyGLaRMIaVFvV7HtCRjd4yTshBCUCzUfM/rRlJqqbU9NKQ13nv6qmx1Gm3DMP1iLivDUK1nMhnftoXhBdFa6EejarVgWJazPhqMvZU98zJwo5PjKIj6w64nDL3155dffuQ7DS+PBiAIrbUQQug3v/nyj33xizcf+NSnPhllU2XTSdlYlsVwMESpmHK5gjQE3W4HpaBYKIKA4XCAVlAqFkEIev0uIMhls0gpGQwHKK1JO2ly+SyNZgMpJAKDUrlIv99HxTFRqJibnyMIffr9HlqDkIJXveoVfOITf8POdgfLtLDtlM4XcrRbLTRoFSvq9Tlcd6y7vQ6GYSK0pFIt02p1iOMItMayHNKZNO12EyGkiFUkCvk8puWITqeFIQ1UDPX6HKZl0Ol2MS0DFUeUSmVSqRSdbgPLcpBY1OpV5uYWWN9YJ5UykRKCMODgS36Ge+/58vqRIzef97nP3d6YCS8PejMfLSC47K3vuPL4seMHPn/jjdHe1f1mvlBAAO12m2IxT7FUJo4jGjtNDMOiUMggkAxGA7TSZDM5FJpOuw1a4zgpEIJur4vWGsu0yRdyNBpN0AKtBaVygeFwSBxHxHFMuVIFoel2O9i2zXDc5ede/ko+85nrWV/foVgoomJFoZgTnU4HISGOlCgU8yA0w9GQdDpNFMVUy1U838MwBIZpIYWgUq3S6XTI5jJoDaZhU62VaOzs6Hwuh1LgODbFclavr20ggMhXmKaJlEJvrK+hNWjtEcda5/MZPn/jDbiehxAGYTyUjzvnCSoKfPOur3313jPPfuLgc5+7XfId1FrGowAE6vLL33nF3V+/55VXX/2hKOVkTNM0STkpur0uSikKxQKlcoV+v0cun2WuPs/SyhKe75HPZZmfX2BpeQnPc8nlslRrNVZWlnFdl3Q6RS6XY2lxmX6/i1IaIQTVaoUwCvFcF6016UyGlOOwubGJZdn0Bi1+7AUvZDDocsPnPkchV8L3fErlMqPRgDAMUUphWynK5SLNViOpQGKdeCoJ/UEPwxCoGKrVKkHg47ouUkogua/b7RDFkRBSCKW1mJubE61WU0RxKCzLEICo1WtiNBrKKI6kaRkyVkquLC/LWEVyMBzIbCYtTcOSpmnx6l99Dbd+6V8DxPCln/jE/zlx6NAhcf311z9qgSCuuUbLxz1OqLe97d1/fOSeI6+58sorI8dKmRqQwmRrc5PRaDSxAMHxo8cZjUb4nk8YRRy97yjD4RDP9RFCsr6+gee5gCaby9FstYjCEK1hbn6OKI7QSpHLZVheWaVWq+B7HsVigVKxyNnnnM1wNKBULiKAH/zBZ7Kysoe///v/S7U8j1Kaubl50IqxO8YwJFIYVGs1mo0Gvu8TxwohJNlshlarCRqCMCKTTmOYkk6ng5SSIAgp5ItorRiPRxiGSRhGVCs1tFb0+j1M00y8T6GANCSDQR/TNFBak0nnqFbLrK2tYRgGUhr0+x1+4oUvVOmsY9zyxRvf9YWbvnQlYFx//fXfUZZp/keB4OBBEb/1j/7sTV+/68hvXHXFFVEmVTBMW5LL5BgOh0hDkLIz5LJ5ev1kEUzLIJ8v0Ov1kJONKBSKdLtdwjBASEk2m2P95Dqe7yPQ5AsFThw7Sb8/xLQk6VQKz4toNBqYhoE0JJVShTu+/FVUHBGEAXv2LvGkJz2OD3zgA+SyJaSEhcU5FpYWOH70KIuL83iux+qevfi+h1IhpmWhYsXq6iqbm+vURJUojLEsm3q9zokTJ8hmM6hYkc0UyOezbG5tAhD4EZZtYTsm6+vrSCkJgxCQ2LZDo7kDaMJQEfgRq8unsbWd3CcQjMcuK6vL+vu///vlJz71V1vP/pFnv/nLX/my1ForIb6zNPDfGwjiuuuuM37oh0R06Vsvf9N9R9becOVfXhWnrKxpGCbZdIbBYEgUhVi2STaTo9frE8chhmGSzeTp93ooFSGFQb5QYDBIYryQglKxmGyMjjBNg1wuh2kY9NweTsrEtEzK5TLNZhPbTi49n88xGo8YjYZIKYl1xPf/t6dz9dUfpN3sYjs2Uhqk01m+cONNaK0BTS6X48Txk7TbbSzbQMWaen2OjfUtmq0uqbRFrGOW5utEYUQ6k8J2LKIo4owzHsPWxjYLi3NIIQnDiLPOPov1tQ0WFxeQUuB6Aaure2g1d8hms5imgev6rK7OI4RiNBogpYlSAj8Yc+GFr1Ff+crtxmjU+93LL79858CBA4YQ4tHJI1xzjTYOHhTxH/7xO36z3fb/6O1//LbYNoWUEpHLFRgOhoRhAEKQy+UYj8cEQYCUgkq1wmg4JoqCpOQqlfFdL7F8qcnnCiilGI9dEJqU4+Ck0nQ7XQxToNFUyzV6/S5RFKGUIpvJYpgm/X4X07QYDru88hd+nttvv5NbvnQrxWKBKIpYXFyi3ergeR5SgmEYlMplWs0mGoVSikwmRzaTY3t7C8NM6v5ioQAYtNstbNskjCIqlQpSGLTbbVLpBBilYgUn5dBsNLFsG61jiqUiy8urHP3GfZi2RCCQhuDMM8/mvvuOEoUhTspm0O/zff/tqfETn/RE42/++qov3HrrbT848QKah0DI/7t5hOuuu878oR8S0SWH3vJrje3OH1177bXx6sqSdFIpsbAwR7vdoVB0MS2LYrHMzs4OmayPkFAsJuEgjhS+D4VCCd8P8XwfFceknDRhENLvD1BKYdkmVi5Pu9VGa42KoVav0u/38XwfKQS25WCaFv1eH9tyaPUa/NiPvZCtzR2+ePNNVEs1XM9lYWGB0XDMeDzGdoxkg0tF+r1+QgNLgW07VCtVtre3sWwTrRWplEMmk6HZbJNKO8nmFgvkslm2traxLIMoijFMCyflsLGxiZSC2IvQWlEz69x2y21EYYhhSsIopFaf4+Yv3sJoOMS0jAnfGOqnPPl88Y//dG2YyWRfO/ECkofYlTH//UDwQ9HFF1/2Cs+L/vRd73xHHHiRTKWyIl/Is3byBFEYY5gGc3N1up0uURhgmha1+hxx7E/IoTynz52BaZh0Wm2qtQrFYhHDMNna2qJYqWBZJsVCga2tbQqlEr7nUSqWCcIA3w8QWgACy7JpNlsIBP1xm++74MnMz81xxZVXUshUGI3GVCplBDJx/5ZJGMaUSyXckYfr+liWJFIRlUqJVqtFEPqY0ko4jmKJXrdPrGJMUySfP1+g3e6A0CAEKlbMlSv0e0l1IaUkDEMWFxfwXA+lIuyUhVaKUqlEyknR63QxTIlhmrQ7TX7mZ35WbW1vGa3Gxgfv+OrXvjCl6R91zOKhQ4fMSy65JHr963/3xXFsfeiKv3yf6Y4CYdtpmctlcd0xnhcgEFTrFUbDIaPRCLQkX8gTBAGj4QhpSPL5PEIaDPp9pJSkUikKhSL9wQDLMrBMk8WlhcTy3QDDtKjX6mQLabY2NjEtG5RkaXWRkydOEscRYRBSLGZ5wY/9GFdddQWBq5LNs03q1Rpra2sopQh8j1Q6RSqVo9tpIw1JFIUJySUNut02hmkSRzGVSgmtod8bYJgi4SjKNeI4ptfrYpoGURxRLpcSoHVamKZJHMekM2kq5Srra+tIQyAEaA0L8wu0213C0EcaEt/3mF+cU7/yml8VH/vY+1sXPOX889/97nevTfZUPaqA8MxnHjKvv/6S6M1vvuzFYzf+qyv+8n1Wtz3SqVRG5LJZXM8l8Hw0gkq1ROD7jMYjQFLIFYh1zGg8QmhBOp3Gti26vR4oMC2LfC5Hu9MGQClNpVJmOBwxHo8mQMmQTqdpd5oY0kJpzerKKq4/xh2PME0b2xH8/Ctfxd9e+0m2tzoU8nmkNNl7+gpbWzu4ozEAqUyaer3KsaNrCKnxPY9cLofjZFg7uYaQijAMSTkpbMehudNAo4jikHQqQy5XoN1qIg1BHClsx6Jaq9PYbiCMpL2ulWZ5zzKtZhvf8yZgC6hUawgtaTabmKZESklv0Oa3X/976uh9d8lbbv3c/7z33vv+/MUvfrF9+PDh+MCBpMN5+PBhnTSqLtHAtKPJA4UN8b32BL/xGxc9y0kX/umKv/gLs9Xs6rSTFfl8njgOcb0xOhZUqmXCKGQwGACCfD6PIQXdXg+lNNlMhkwmS6vdJGkdm5SKBfr9AbFSqDimUqkQxzH9fg8pJYZhksvl6Pa6CAFRoJibqxPFEY3GDrbt0B91ufDCl3HyxL3c+PkvUMhWCMOQcrnGeNzH8z1sy8EwDJZXVum0O4RRgJQ2pmlx2mkrNBqN3bxECJPV1VXWT6wRRSFIME2LhaUljt13jDD0CMOYWIUsLS7QbPYYj/rEscJ1R8wvzBNFmlZjB8M0iaII05JUq/M0Gw2EAMOQDEZdnvHMZ6of+dEfkVd/8L3X3XvvkR+Oouhh7Zf5vQTB6y56w9Nq5cW/ueZjf2WGQazqtTmZy+YYDAcMBkMUmnKpjB/4dLs9QJPJZNEaOt0OaIljOeTzedqddoJmLaiUywxHQ5SOUUpNehCSVruJYZhIaVAsFul02qAVcawplkpIQ9BudMhmc3S6LZ77Iz9KGATc+PmbqRTnCMKAWrWKRhHHMY7jEEeKSqVCY2ebfr+HZdpE8YBypcYdX74Dz3MT8kcpKpUqm+tr+IGLY6fQWrCwsMQ37r2bYX9EOp3BNE32Lu/FtCS9/pB6bh5iTbaYZ3l5mSN33025lCeKNJ7vcfq+01hf26FQCpACgiCi7Eh+/CdexMcPf5j5+ZqnVPzq5eXlVDqd7t91110b5513ntFut9tra2ujF7zgBcb6+vp2FEXh85//fHHeeee1n/zkJ8dSSpWUwt8jj3DNNdcYBw8ejH/zNw89KVfI/fPHD3+80txpqkw2K+fn54hj6HSaSCEoVcsYhsH25jZhGJPNpkk5aTY2N1EqIoqgUimxs7Od9AMiQaVSxvXGeK6LUkk9XyoV2d7eQUiBVlCtVXBdF9cdoRWk01nqc1WOHz+BbZn0+yMe9/hzeOpTv48rr7qSdKpAHEek01ky6fQEUAZRFFEulTFNk0azgWVaBEFMuZQ0u3r9LoZhEocxhVIB0PR6XaQ0iCNNvpDHNCTNRgvTMomipMKpVCucOHEc07IQCExDsri8TLvdIgxDbMtBKc3i0jLlSp6TJ05iWSkM02TQ7/Df/8eraTRP8ref/AjliSeMogjDMAjDEMMwiOMY3/eDQqEgx+PxQAgR53I5hsPhjmma5tLS0luvu+66KyfscvyIeoQDBxIQvOY1rzszk8l84kMfuLpy3zfui1OpjAGS48fWaDQaWLYknc4ydj36vT6maZLNZcnlsrTaHdKZFKZhsLK6h8Gwh+1YqDhibn6B4XBIq9WiWMhj2SmKhRz3HT2GYVhEcUC5VGQ8HiVaBQFCJK3rtbU1hICRO6ZaL/G0pz+DD3/oAzhWFkHSAMrncnS6baQURKEilcqQSqfY2tpKFjmKyGTS2I5No7GDNCRKxThpB8e2abaamGbCMKZSDoVCnq3tLVIZBzRIabC4PE+r0SKTySTvE8WUKmXG4wHj8RApDcZBiGFaCKG4+Ys3JRYrTHzf48wz91MqZfnwhz5JtVolSoQKSgiBUkpIKYVSCiGEtG3bdl0XoJwkqj2CIKi5rotlWeXvSWhIypaD8a++7nVn14tLn/7Ih/9mz7Gjx+NcrmCUiiVs22F7ewc7ZZJy0jiOk9T5aBAaISR33vn1pGWLoFQu8eXbv4LnJgRRws3v0O12sSwTw5DMz9doNdvU56pIIanV6xiGZHNjk3q9hh/47NmzyvbWDrlcljCMMS3BS1/6Ev7xnz7NoO+STmcYu2PqtTmazQZhlFiU1lAuF2i3W0lbGYEwBZVKhXaniTRkwjJqQblUpNPtJJyFSsr4UrlEq9VEK4UwDYIgYm5+HtcdM3ZH2I5FGEaknBSplM329ja2bQEQqpg9e1bo9doYhollGahYEsUeP/vzr+Sf//nvATXN+GQYhtKyLJRSaK2RUuL7vnYch2nukFyTVkEQiHw+/403velN73vRi17EtMIwH8lw8Cuvfe0Zy/XT/uHwxz6+5557vh7n83kjk01hmibb29uISfKUTqWTfj/Jh65Wa3Q6XYRI6vtisUgUKQJ/jGEK0qkstm1z8uRJpBSoSV39lTu+hh+4AGQyGTwvYGtrh3TaQUpBrVpne7tJtzsgn8szdof83IW/yPr6Ou7Y5/FPeCzD0YiVlSXGrktjx0RFCtcNWFiYp9tLRCYgCPyIWr1Ks9VkNBphmZNGUa3OcDTC9wMsyyQIQirlMnEc7rrpKFTk83kymRQnT57AMBMyCS0pV8p0Ox20VoBJFMaUSlWEIWi1mti2g8CgP2rzvBc8lzgKuO3WL7C8vIjn+UkH1LZRSu12NaMowrKsqWdgmgv4vi+EEHLPnj2HXvSiFw2mYeERAcKhQ4fkwYMH4wsuuGChXlj66098/BN7b739i1HWKZqO45BJ5WjsNEGAZSX9gl6vj1Y6EW9UqnS7PQLfQwOJLE0zGg7RKEzDJJPN0G61MQwDtKZWrRGEEbFSOI6DaRpUShV2mk1MU+D7Hpl0hm63R7fbwrId1jfv4znPfg4nThznmsPXUC7W6LS7VGtVBv0RG5tr2FYKwzQ47fQVCoUiXuCyv3I6nhtQq9dwUg4nT55gbq7GaDQikymSSlmcXDtJKu3gu0HyGpbB5sZGUrISE8UxxVKBrUmTKSl3FZVylSgO8QMf07TQOtEeLCzUOXb8KIZhoJQiikIqlRLPfd4LuOrKP6NarRBFMUIIhEiIqElomJaHu7zE9OcwDGPP84xyuXzDDTfc8DEhhJyC4GEDIZGdv1E9//nPX3j+8w783Weu++wTjxw5Es/XVkzTtkg5KTY21lFxjDQkuWyOdntqZbCwMIc7cpMevRBks1ksy6bb7SGFwJAmxWIpcbsTTn/aUxgOE1IpjpOsvtXpEMcxQmgy6UzSim60SaUzDId9HnfuEznttLP4wAeuoJhPRC6WZWMaJnd9/S40GiGGSJlY5R133Ik0JAJIp9I4KYt77tkGLTEtSSplsbwyT6vVZn5uLmkRK8VjHnMWG5snSacchJCMRiOWlpYZu0m72bQsPNfHthxsx2RjfRNhCKIwxvcD9p62h3a7mVDatoUhk6bZL/zir/GVO26lsbPN0vIyQRBMLf/UkIBlWZO1SLyB1lr7vi9s2+b888//XSGEmjCQD79qmIpNa7Va7n//74uv/9wNN5x/47/eHFVrNdMyLRYXltlpbO/G3EqlwtrJDTx/TBwryqUS/V4v0Qqicew0qZRDp9NGMGkSVSv4vo/v+2ityeWzOHZq0tdPLKBWrzMajhmNB5imgRAGpWKRXq+PUok1FgoOF77kZVx99UfxXS+RfynFnj172Nlu4PnjxK0KQb1Sp91J+ILp5tZr83TaXcbuENOyCIKAer2OO/YYDJP3jeOYhYU5DNOi3WphmQ6GIcgVsqyunMbG5jpSioSqDiLOOvscWq3GhGQyGA3HpNM5lpbnufPOryZaBj9kOO5yzjmP4+df9Ytc/ke/T7VaBTRBEEySyN3N3m2mTcvZqUw/iqJ4MBgYS0tLH77zzjt/No5jeSr7aD4cEGits6973RuuueGGz55/7bWfijJO2RyPT5DP57nvviMIDEzLYmFhgaPfOIoiwjQsFhfmcBwTpWIq1TLpdJpiscKxY8dIZzNorSgWEv4+DMdoAZbtYFkOjZ0GehIH5+bq+J7PYDCYaPs05UqB4XCcJEkCgtDnJ3/q5Xz605+m3+2QzeUJAp+FhQW67R5j1530EUJq9Rpjd0wYBRiGnGz4HL4f4PljbMdGqZharYZpWPh+l0wmhVIxhUKOVCrD2smEGo5jlyiKSKfT3PKlW/F9H8MQxCqiVq1y19e/zvrGBqZhYpkmlm2wsrpCq9kklUqTSacxDYNI1fnFV7+aT/zNR7BtKylDwxAp5e5MxtQbaK13PcTMzIbyPE/Ytj146lOf+rt33HHHI0MxTxXHq6si9Wu/9o6/ufHGf33eJz95bVzIlQ1DmuTzuUQMqmK0FlSrZYbDIaNRIgnLZrKIiaLGsmxs26ZULjMYDJMLNS3m5uYwDOh0+ti2RSqdYWlxgaP3HUtcogool8pEkeLY8WNIIfB9n0K+gB/4DAdDLMtk5HU4ePAg21ttrv/sZyjly4RRQK1WxTQdtja3sCyTWIVkszks06Hdntb8Iblsjlwux/bODqYp0UpjWhaVSpVmo4XS0e4iLiwu0Wq28bwxppV4iGq1hlbQarWT56MSlnJ5mRPH14hVhBCCOI7I54rYls3WzjamYWBaJv1hmxf9xE/zhPPP4z3v/EP27dtHGAa7SegpVr8LDCHELq/geV48GAyMffv2/cHNN9/8+y9+8YsfsCn1UIEgphM4l731Tz98yy23v+zwNR8NS4WaJQQU8okYNHFbknq9OhF9jEBPcgDbotftIaRGYFIsFun1ukRRwhLmcjnQmk63i21bSCGZW1ii30t6CraTJp/PUa/X2N7ZxnHSaKVYXl0mCjXrJ9ewbItut8P3fd+TWFxe5OoPXoVtlfC8IZblUCqVWF/bwJDJ5tiOTalQpt1uJ4mXFEiZSNx2dprEYYQwQCtFfW6efq+P6yXhJIpj6rUaUajpdtuTNrTGti3K5SrbW0m1JKUgCEJWV1YZj13anSamaSbgMk1q9Tm2t3bQOkZIiKKYbM7hkj+4lHe963LQAalUelcrOQ0JUyAEQYBlWbvhYZI8qn6/L9Pp9LH3ve99T3rOc57Tn+yjfjgU867i+I1v/MMrb7vtzpcdvuaaqFyoWlprisUSo/GQMEpQXq1V8HwvaQAJSSqdwnFsOt0u0hAoBaVSgdFwmFjGpMdgOwlQstnsZOFrDPpdxmN3F+lSaI4dPbqbNefzOaLQZ2Njk1wuRxD5nHvOOTz28U/gI3/1Ec444wkJ8LTJaaft4diJE+TyOaIgkaaVKxXW17ZxUg5hFOK6LvPzC2xu7uB7XlIC+iHVWgXf9XHHHqZtEseKfDaPZdp02juT8JRUBIVqiVaznXQypUHgB+QLBZSCVrOFaZvAJFSU6/R7yTqYpgAMBqMWv/Q/fotbvvQFWo0tVvfsIQh84ji+35heooEM7pcgTr+CINBBELB///43POc5z+l9uxb1dwoEcc01Wgoh4re//b1/effd33jlNR/9aJTPFk0/iCiXy7Q7XeI4SiRbtSpxFDIcDhFC4tgOuXyOdruVtFVVUgKO3RFBFCSdwkyadMqh0+1gmIIoDKnX63ieOxGLJjrbcrlMf9DDcSy0Ejgph1qtysm1kwgh6XX7SNPg/KecxxV/+R62t1pYVgp0zMLCKhsbJ/B9n1Q6BdrkMWeeSRh7VGsFHGeeKIpZXJxHKVhfWwOtGAwHpNMOjpNj7eQxEALX9VFaU63U2dzcIQz9ScmmqNUqBEFAEAQY0kLHGtt2qNfrrK9tgBDEUWLN2VwOgUioaUOgtWQ47PHk85/M/rPO4tI3/w6LS4vfEhKmCeL05ziOd79P6PF4NBoZ+Xz+c1/4whf+CpCHDx9WD6fpNPUE8SWXXPaHGxtbr/r0P/xddM7ZZ5lCCBaXl1hfW0cIiOOYUqmE77tsb7dBC4RIdAPNZhOtNFEcJzxA5DMejxFCYFs2uWyOVqs1iZmaWq2G0jG9fh/LNlEKKuUKo/FoV6iqtWBurs7W9uauWijSHq96+X/nczd8jq3NFqVihTDwKVdqRLFLt9NFSslwMKJSKXPvPV9jY3ML27KSWYdSBd8d0ersYMoUjuOQz5dY3buHZnObPXv3JUyfVqysrNJsNjDtJIkMfBfDcEil06yvHSWONUQRXuCzsrzK9maTQX+I7dgTyllQqZRo7rQwzQkXEAukAT/zs6/gUx//GJYpATERye66/N2fp95g6iGS9YtxXVcA0VOe8pTfO378OAcOHBDfDgjiO/EEBw+K+LK3vP3S9Y3t337ve98T2VbKlFKyvLyM74eMx0NSKYdSqUypWGZreyMZyjAM6vU6x44dJ5ogOpvN43t+UjbqRHhRrpQm3UdQcUyhUCRfyLG9tYWQMhF2lCpEUchg0E8EIHHM6soqvX6Xfn9AKpWi0Wrx0gtfTBC6fPzj11Kt1An8gGw2h5OyaE1IqSiMyWazFIsFNre2kEImAyemSaVSYWt7E6ViBIkLLpXL9Pt9fN/FsZMeQalcS3ojrcYkpNkY0uKMM8+i0djC991EcDryyeczFAoFvn7XPQilGY3HjNw+9WoN34dWcxstNIaQuGGXC1/yszz2cY/nHX/yZvbt208YJSzlbJUAEIbh/YikmTIyHgwGRrVa/dA999zzcq21MUsePWQgTCVml132Z7/XaLTe+O53/lkkZQKCuXqd8XhMt9vFMCSW7ZBKpem0O1iWCWiWlpcJgxA/8LAsk1KpRLVWZe3EGqZtoeKYpeVl1k6exPVcxkM3aSTlc6xtrKNVIvYoFkvYjpW8l5SEYczCwgJCwE5jB9u26XbbPPUHnsY555zJFVdcQalYIQojbNuhWComcwaTmxSJJG57exuNAi0Iw5j5+TlG4yHjkYs0BFGUUNmmaUzq/SS5syyLUqnM5uY3mcIgSHKIOFIMBgNs20EaGtNKc8b+ffR6bZQG27YQmFTqVebn5zj6jaPEUUQYhQSBh5O2+bVffy1/9vZLiaLxboI4ZSOnFj/Nl8yJbmGmhNT9fl9LKYc/93M/9+TLLrvsG9+Jakn8W/2D3//9S18zHIz//H3ve28sMCQaUa/XiGOVuHIJqVSafC6fWLkAtKZeq9MfDBkMhkgJlmlNdAUdTFOiFCwvLSEMQa/XJ51OYVsW+/bvY2N9nTCK8P2AbC5DNpPlxLETBGGI5ycaRNMwObl2Esex8VyPPaet8tM//ZO85z3vxpAOoFFKMFev0R/0JwpkSRQm4BsOB/R6SWUSRTGlYhkhkxE727IIoxDbTlEuldhp7CQrqTVaC+bn5+lNhmSlFCityWXzZHMZtre3EMjJRiUl5Hg8otvtYhpGojeVksXFJVqtJkprUk6KbDZLrH1e/4ZD3H77TVz7qY+yupokiGEY7iaD057CLIMI7H4PwzAejUbG3r1733jLLbccmu0nPGRhyqFDh8yDBw9Gl/3Rn/xqc7vzjr/4i/cqFQkppRbVWhWloNlK4pohzV3qWKPRkaZSqeC6HuPRCNOUWKZFpVyh2W4m8VUlzOJgOKDVbCENSaelqc/N8fkbP08QJMLVbCZLuVxlc3MHJ+WQL+TJZLOsrCxz1113c8Zj9uN7HlrAy37m5XzsIx9ExRKBwvN86rU63V6P0XiIKS38IKBWrxPHIcNRwjVEUUwmncFJJa1lw5AorTGMJEx0O21AIw0DFcWUy2XCwE/6A5NrkUgKhRzNVnOSsUMcJaWwZUv8jkc2l5nkAAklHkZeQgwZBn7g0mhv8aTznoRSAdd+8qPU63XCMJishbkbBrT+Jqs4zQumlUQURWo8HstcLnfyT/7kT/7k6U9/+r85/PqgQNBaSyFE9Nu/ffFLt9db73jf+96jVCSFYUhRrVUwDJOd7SaGIRFCUiwV6bb7CVp1TL1WRytNr99L1LbSpFQs0e52duNbLpcHJN1uByeVWG+5XMXzfMJQYZkWsVKkUmnuvfsexq47oY8FlWqdb9x7FCESvUAUu/zyq1/NnV/9CrEyeOxjz2U0GlGt1zCl5NixY2SyGVzXw3Fs0pkUJ46fwDAkkUqSq2w2S7PZQOtEChaFmnq9RuAnG54sckw6lSaTSSUNJSPp9GklqM9VGY6SmQzTtFAqnuQbiTcxTLGb0adTiZ5hc7OJYRq7brmQy/CLv/RqPvXJj6C0wjANgiDYpY6noUAIkYhXbHv39ykYPM/TWmu5srLyO09/+tM7D0XRbJ7KGgoh1Kte9eoLK+XFD3z0ox+MM5mC8lxfpFMpEUeIkyePC0NKYZrJ3F+3MyCKE4atVCoDiWRMSJFQvqUCvf6AMAgQUpBKpXFsh1arjW1bE1atQBRGjIZDDFMQRhHz8/N4rksYh6TSNlpDpVJlNBglsdR22Ng6xot+4gB3fPkrfPJTnySfLbO1uUWxmCeTzbG2tkHKscjnMhSLec4882xOHD/O2eeciUAwGAxZWlym2WxMyBiF77ukUgnNvb2zjZQGAj0ZqiklJbBMjCCOFJlsBsMwdkUleiKNq1VLjN0RYRhimsYkkZOUKxV6vd6kaygwDEm70+FlP/tyOp0mN33+evbsPY0wDHfZwdmjfXZb2zPgmJaLrusatVrt8zfccMNHhBDyocjaHzA0DPvdC269/V+ts889iyc+8YmGH/hkMgW2tnbY01rG9YaYZpqNk5v4wYBYQSaVJ45jtrdOYtt2kifUkxnBIEgyXsM0yKQzdDqd3QQrn89iGCatVntSJkbUajWiMKI/6GGaCVtWLJbwvQDPd0k5Dp1em2c84xmsrC7x7ne+l0qxloQmLSiXKnzjnm8wdt2JsiigWq2ytXHD5OgdGyklc3NVTNtAEbG8vIyUAtMy2LPndI7ccwQnZRP4EePxmHK5zGg0YjhMBmCDMEy8QS7Hzk4jCScT8OdyWdLpFBubGwkIJmVzuVxGxdGuyhrA8xLxzA//8HN4+9vfSKVaQ2vw/akniu4XBsIwZCo4mRJHURTh+76QUurl5eXfEkLEkyGXhydn1/qQ/Kmf+tK5Iy88Iw7ifalU5kyl4tMN0zrDMOwFx04Jy7LSUaSQQhDGCkGa9bV7GI1cWo0hjmMxGHbodoYoHSClSaVcZTwaT6xDkc5kyRdytBpNNJpYxRQKBRwnTWNnB8NKxKqZTBrTsBLxqG0yGo5YWJrjJS99Ke9597tQsUwaNFHE0vIK4+GYZruJbVkoFKViEdOwaTSaGKZAqRjDMKlV66ytrcFEHYzWLC0toxQMBl0KpcKuEHb/vtO5++67Jxaq6feHrKyu0G632N7aIgxjwjAgjjXLy0tsbW4RhEmNn5zMYjK/MMfOzvau/F4KSafb4XcOXcz25nEOf+wDrO5Z3fUGU8pY64SGnkjMdnOCaYIYBEE8Ho+NhYWFvzpy5MjPPFB38bvyCEJcooCvTr52bz/wAz+QT6fT9nq3fXm703tFOp1Wjp2WlmORTmWp1irML5iceZZNPl9iOOwxHAYMx23SdonNjU22to8ThjFRKDFMydrJE2idiCuy2Qy5bJZGo5VcsApx7BS2lUna0wKCMCSVMXjpy17Khz98DeNhQL6Qx/d9qrUqURjR7rZJpx2iKMaxHRwnxfb2DtLQJCW4YGlxkWarjWkl3T+lEzcfRfHu/OJoY0wUKZaXYu65+17CMMK2jaQ3UEtOb/E8j8WFBUzLJAgDTj99P57rIpOBKkajhBldXFyg3eowGo0RQmIaNsNxh6c97Zns2bPMFe/7Y2r1Or7v75JE00pHKbVbMk43fyZs6DAMpW3b/QsuuOD1d91113clLXiwJ4lDhw6Jr33ta2JnZ0fMzc3pw4cPCyB68pOf/IqdnZ13+0HgCBBKKWEYyRyBJkG54ySK25TjkMnmyGbzOLaNZaVJZzJIIclkCnS7bdqdJq3miF63Ty6b5eTJ44k6SUfJmUO1efqDROpumia9QYf/+Wuv4cu338aN//pF8rkiQeiSyWapVWucOLGOkZBxSDFVQHWJ4iS2TrUEWkOn00aKRIBqWha1ap2dnZ1k2lpKYqWYn5/HD8KJxsBCExPHisWlJTY3tiY5gEQpjZ2y2b//THa2NpFS4jg2lmlQnauxtLjM1+/6OoZMHhv4AbGKee1vXcTHD7+fL9/+JcrlpD8z2y+YWv9sP2E6rDLVGriua+zbt+/i22677ZIH6y4+UpNOJhD9+I//+C/dfvvt752c+qGVUmJKa04ZriT2JYnQ9MNO1cSmaWEaFpZtkcnkyOfyOKk0uVyeXKGAIW1cN0jKM3+EaeQ4eeI4ne4O42FIs7XFT7zox/E9xd/9wzXkUgvEKsJxHFaWT2Nza4M4DkCQKJfKibBlOBgiJ5l7Ppcnl8uxubGNYUqEAXEYMzc3x3A4wvPdibo4IpvNUSyW2dzcmHhagdaK+bl5gjCm3WpiWuZE9RyxumcvrWabfr87seSYWGlWVpZpNbsEUUA265BJZ/GCPj/38l+gXK1z2VvewPzCHFEU3S9BnJJE0xbzdFJpus5RFCnP80QqlTr6v/7X/3rSRRddNHqoU9Dfca/hmc98pvnZz342evGLX/yLN99883td11WmaYqJdHqX357Vy2mtiCK9y/8LxKTs8ZAyQHqSfr/HehwjpUBKEyGSCy8UymSzOWzLoVgK2PeYFSzjdGIlMG2b8590Pn977bU84fHfz9gdMhpFFPNF1jeP0uuNMaQkUiGVcpJ0jUYuhmkCyeRxoVhgZ6sBItnYKIgolUuEYcSgP8ByEgWzFCblYolGs5nwCJOWczadwbRsdnaSElJrnYhYqzWiOElwk6knidKSuXIZrQVRFGBbEt8P6La71OcqnPXYx/Onb38zuXyi05y1+unGn9pgmt6iKCIMQw3Ixz72sX9w0UUXDSblonokQ8MuCK6//vrouc997k/efffdH+/3+3oii76fJ/im5YtvQe30b0qp+5VCu95DiN0PMX1+cgRN0jZP7oNsNks6nSUMfebnlymXKwhp4DhpcrkSvW4Tdxwlh2URYxg5jtx9F2E4IIwUcZQcmzcaDgmDENNK8oJsJkexWGR7ezt5PwlRFDI3t4g39ugNE0YQLdBCsbSwRLPZJoySYVQVJ9Kw5eVV1k6eROkYSHIRy7SZX5hjbW0DrWIQYFs27V6DQ5f8Advbm1z9gXezuLiE67q76zm7PlNCadpVnOkuqvF4LOfm5r5wzz33PG1yjN535Q3+LY9gXn/99dHTnva0H7vzzjs/Mh6PtWmaWiklp5s2JTJmATH9OtWVTQC0e/+0rTz9+8yA5q4ecfcxUuC6Y0ajRADa7399crZSjOOksG0HyzbJZLOUi3UymSKWnWZl9QeREkZjH9NIoWLF0aNH6HYGDEcttDawnRQnThwjihIiC6EpFIqJNxmPsYzkviiOE/Xy2MXzkgOxNAnZs7KyTLORTCkZ5oRjiEOq1Qrdbh9Qk6N+JP1Blx982tNYWlnhPe+6nGq1hud596ORp2sybS1P12YaIsIwxPd9bdu2vuCCC35HCBE/HG/woB5h6gl+6qd+6sdvvfXWj47H44yUUk89wakbOA0R09+nmz57EaeGkFlZ1exzZjPjRHGtd1k50zQmcfqbYNsFHBArtTs9ZBgGmUwGpQXpVIpqtY5l2ViWQzZbQBqQyRRw3ZBGYw1vHLKz3cbzRpRK8xw/dh9BONoVf+RzecrlGo3GNqZp7brncqVEJpNMREsj+bxxHFPIF8hlc2xubSdnH0zEOAqfP377O/jrw1dzy82fp1gsJafEzEwrJ9ealIvTmYXp2k3WOfZ931hdXf3IXXfd9bI4jr+jfsJD9Qjy+uuvjy688MIfueWWWz42GAzShmGoSW36LeFgqqmfXsTshk4361RZ1ezzT1XcTC969jUBLMv6FgDOllHBhHGbHoIhhEgGUSyLfuDR7bZRWk1mIdOTgRJJpVojl82Szlg89vH7KZcqgMXe05dR2sVzfXodl3wuy31H7yNWMB5Mz25MkUlnOXkiGaczZNKnsG2DUrnC9lbSu9BKgSHpDZq88hdeRafd4qYbb6BcLeN57q7yeGoA06bSVI085QwmIUF7nify+Xzvec973u9NzmF+2Id3n+oRJKBe+MIXPvv2228/3O/385ZlKa21IYQQUkoxRe6sm5+Nad9MGPX9gHCq95hly2bj4nQhpq8xO8Ez0w/5FsDNvvZs2TV9fHIGYsLhfzMEScIgQOkkcUyGTBKyq1ark0nnENKkWq1SLtVxPZcohjgK8H2XXG6OzfVjrK0dxXVhNOwRxAEL9SVUrOl0WtiOg23ZuP6YpeU6b3zTW3nLW36XVnML23HwJlY/GxJmc6rp/dPriKIojqLIOOuss978pS996Xe/0+7iQwaCEEKdddZZn202m0+fKmFmrFRPk5Jp/DYMQ07QKmY3+NS84X5vMoPw2c2dWsZslnzq8XAPBIzZHGTWxc4CY/b+2dxFk1gyJF1DpfRu6aviCDUZXo3jCMOwyGazZPMFLMOkUCpQyNewTBN0UlUgBCknzx133E4Ujuj3fIaDLmO/y6VvfRvHjx/l6ve/m9pEz3Gq8cwmiLP6g4nuQPm+L+r1+ubFF1/8hFe84hWdh5MgfrvQoLXWnH/++a/Z3t5+7s7OzulRFO0PgmCP53mLWutiGIYiDMPdtugMJ66klFOgCMMwhNZaTDZVzG7U1AXOlkOzm3NqWJnepgtyagt29rVnF3TWmmarltnXNHZBlQziJmSSCRqEYWCLJOzYdtIlHY+HDAa9RMF0fLILWpDJZMjl8kjDIpfLc/q+pWSSSlrEKpnkTqdzXPupj1GuVHaHdmbD47TTOFs2Tj93GIbEcaxN05T79u37vVe84hWth5sgPiRCyTAMbrrppszb3/72Sq/XO204HJ41GAzOiKLoMYPBYCkMw/1hGFaUUub0IuI43r24iWXGUkotpRRaayGlFJPNEKda+alWfaqXOTXnOBUEs8CYzbannmY2dEytbnqds4+bJclmwTTL+JmmuVveTqePkopHJwd0KI1jO2RzeQzDxHXHE8FMfD+rn4aAaYKYSqXud87B5P3iIAiMpaWlL91zzz3f/90coffdAEFOxI5TidO3oG5iceLSSy+t/Mu//MucUursXq93ehRF54RheIbv+6cFQTAXx3EmCILdcmg2L5BSKqWUMgxDTMKEmH7N5h+zG/hAOcBsuJm9bxYEp4o7Z19/FkAPFoqmj50FzCwwEgtOSt9vejSDMAh2R+gNw0yU3pNwOzu3OH3dabicJtAzCaJ2HEc/+9nPfs4111xz3SOVGzxUilkAu/+e5tsBZJrhB0GQ+fVf//W5++67b1+z2dzb6/X2m6Z57nA43BvH8WoYhuUgCMypZc8qcCYhRs1YvzATwb841UpnN/fU+2Y9zQMlsbOPO9UrTev1aQdwCoJT33uWBj7V68w+dvr71OqnreRZBnF2bnH6XpOwEEdRZOzfv/+ar371qxdOuJxH9D95iEfo+eLAgQNiZ2dnehJ4/GBhRgjBpZdeOnfjjTeuNJvN1V6vtz8MwzO11o9zXXdRKbUQBEEmGQePvoVUkVLGs681AceuF5ndoFOTw1n3PutJppv4QCCYnSo+1UNMLXn62FPPI4jjeLcieDCvNZ1X9Dxvt4ScClInTTIdx7EuFAruS1/60vPf9ra3HTl06JB4KP+m5z/yeL0HAggP5kWm/MNnP/vZ9Pvf//69a2tri51O5/Rut3tGFEVnRlG0L47j5SAI5qYhZjraNZNPqEkeMrW+XS8ya5GzNPeswme2/J0tY2dDQtJpNO+XryR5gfyWpDQIgl052SzLOpubnFpZnerRploDrbVx7rnnvuWLX/ziG77b7uJ/+IGb/1abexJm9AQg+oFAYpomv/Vbv7V49OjR1fvuu29Fa312q9Xap7U+Q2u9x3XdRSA1rWZOtd7JGUNaCKEniaoQQkwHdx4wL5i17Nn4fSp9PhsSpoCYziCcWt5OE8RdXmPy+WY9ymxpHYahiuNYlMvlE69//evP+5Vf+ZXeI5kgPhqA8J0AZPb+B57XM03e+c53Fj//+c/PdTqdPa1W68xer7c/iqIzfd9fCYJgTxiG1akXmU1Wp8O8QogpSIRhGCKOYzGxWHFq5fBA9f7sBs5SwQ+cTN6fYJuC4IE8yuTzxlJK47zzzvuF66677qrv9njd/4xAeNCb1locPHhQngKQB/QiE6uyLr744vJtt9227LruWZubm6fFcXxmEAT7xuPxHiHEchiG9jTEnEqBT84hVNP8Y1rVTG73K49nN3AaPmYrk1OTyVmrD4JgN3GcTUajKIrDMDTq9fqNR48efcbD7S4+bD3Co8ZVJAsRfzsvMq1oVGLOIbAz+bptNsy85S1vyd59993Ld9555wpwdhRFZ4zH47OGw+GeIAgWlVKVKIrktL8yIXN2J4mEEPGkkplNVgnDcJc4m807pps+e3aBaZp4nofjOLshYxYMURQJx3HiJzzhCa9/JLqL/894hO/22mYld9+uopkMkRi/+Zu/WT1y5MjprVZrbxAEjxkMBvuDIDhLKbV3PB6X4zjOTL3H7KjZxGvFMyTabtmtlBKzVcVsS3k2V5j1BkopY3V19WN33XXXS74X5eL/n4DwUAHyoMmqYRhce+21hauuumpxc3NzNY7jM33fP3swGJyhlDrd9/2a53lVrbWYAuQUDkFNEtXp7yKOYzE9Au9U8iiOY51KpQYveMELLnj/+99/L9/liev/BYRHACSf+cxn5EzJq79dLnLRRRfN33TTTQtKqf1RFJ3T7XYfEwTBGVEULfi+vxDHsT1NVk/hJbSUUs98F1prFcextW/fvjfdcccdv/dIM4j/BYTvTUWjH8xSbdvmQx/6UOW6666bP3LkyJ7RaHRWo9HYK6V8rO/7y0EQ7InjuDD1HtOENYoiarXa+ute97rHvfa1r+3NvM9/AeE/A0AATgHJg7KrURQ5F110Uf0rX/nKQrfbPcP3/bOGw+HpSql9QRDsPfvssy/+x3/8x6v+vbzBf93+HUreQ4cOyQMHDhiTTTV5kFG0SbiQ73rXu8oziea/2+3/Awqav3cIYXRCAAAAAElFTkSuQmCC',
    _PVS_HYBRID: 'data:image/png;base64,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',


    showVersion: function () {
        if (vis.binds["vis-2-widgets-sigenergy"].version) {
            console.log("Version vis-2-widgets-sigenergy: " + vis.binds["vis-2-widgets-sigenergy"].version);
            vis.binds["vis-2-widgets-sigenergy"].version = null;
        }
    },

    // ── Helfer ──────────────────────────────────────────────────────────────
    _fmtKW: function (v) {
        var n = parseFloat(v);
        return isNaN(n) ? "-- kW" : (Math.abs(n) >= 10 ? n.toFixed(1) : n.toFixed(2)) + " kW";
    },
    _fmtPct: function (v) {
        var n = parseFloat(v);
        return isNaN(n) ? "--%"    : Math.round(n) + "%";
    },
    _fmtKWh: function (v) {
        var n = parseFloat(v);
        return isNaN(n) ? "-- kWh" : n.toFixed(2) + " kWh";
    },
    _fmtMin: function (v) {
        var m = Math.round(Math.abs(parseFloat(v) || 0));
        if (!m) return "0 min";
        return m < 60 ? m + " min" : Math.floor(m / 60) + "h " + (m % 60) + "m";
    },
    _socCol: function (p) {
        return parseFloat(p) > 60 ? "#27ae60" : parseFloat(p) > 25 ? "#f39c12" : "#e74c3c";
    },
    _el: function (id) { return document.getElementById(id); },
    _txt: function (id, v) {
        var e = vis.binds["vis-2-widgets-sigenergy"]._el(id);
        if (e) e.textContent = v;
    },
    _css: function (id, p, v) {
        var e = vis.binds["vis-2-widgets-sigenergy"]._el(id);
        if (e) e.style[p] = v;
    },

    // State-Zugriff: vis.states[key + '.val']
    _val: function (data, attr) {
        var oid = data.attr(attr);
        if (!oid) return undefined;
        return vis.states[oid + ".val"];
    },

    // Darkmode-Checkbox: VIS-2 liefert Boolean true/false ODER String "true"/"false"
    // Diese Funktion normalisiert beide Varianten zuverlaessig.
    _isDark: function (data) {
        var v = data.attr("sig_darkmode");
        return (v === true || v === "true" || v === "1" || v === 1);
    },

    // Subscription mit VIS-konformem $div.data()-Muster
    _subscribe: function (wid, data, attrs, onChange) {
        var $div  = $("#" + wid);
        var bound = [];
        for (var i = 0; i < attrs.length; i++) {
            var oid = data.attr(attrs[i]);
            if (oid) {
                var key = oid + ".val";
                bound.push(key);
                vis.states.bind(key, onChange);
            }
        }
        $div.data("bound",       bound);
        $div.data("bindHandler", onChange);
    },

    // ── Widget 1: Energiefluss-Diagramm ─────────────────────────────────────
    //
    // SVG-Koordinaten (viewBox 0 0 300 248):
    //   Solar PV   oben-links  (58, 42)
    //   Batterie   oben-rechts (242, 42)
    //   Netz       unten-links (58, 208)
    //   Haus       unten-rechts(242, 208)
    //   Hub ⚡     Mitte       (150, 125)
    //
    // Pfade:
    //   PV   → Hub  M58,63   Q58,125  142,125
    //   Bat  → Hub  M242,63  Q242,125 158,125
    //   Netz → Hub  M58,191  Q58,125  142,125
    //   Hub  → Haus M158,125 Q242,125 242,191
    //
    createEnergyFlow: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createEnergyFlow(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "Energiefluss";
        var cls   = dark ? "sig-ef-wrap" : "sig-ef-wrap light";
        var tc    = dark ? "#e0e6ef" : "#2c3e50";  // text colour
        var w     = widgetID;

        // ── Einheitliches SVG: Pfeile + Icons + Labels + Werte ──────────────
        // Alle 5 Knoten liegen im selben Koordinatenraum wie die Pfade,
        // daher zeigen Pfeile immer exakt auf die Icons.

        var svg =
            '<svg viewBox="0 0 300 248" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +

            // ── Pfeil-Marker ─────────────────────────────────────────────
            '<defs>' +
            '<marker id="mPv_'   + w + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#f39c12"/></marker>' +
            '<marker id="mBat_'  + w + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#9b59b6"/></marker>' +
            '<marker id="mGrid_'   + w + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#3498db"/></marker>' +
                        '<marker id="mHouse_'  + w + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#27ae60"/></marker>' +
            '</defs>' +

            // ── Animierte Flusspfade ──────────────────────────────────────
            '<path id="sig_path_pv_'   + w + '" class="sig-flow-path pv-color"    d="M58,63  Q58,125  142,125" marker-end="url(#mPv_'   + w + ')"/>' +
            '<path id="sig_path_bat_dis_' + w + '" class="sig-flow-path bat-color"   d="M242,71 Q242,125 158,125" marker-end="url(#mBat_' + w + ')"/>' +
            '<path id="sig_path_bat_chg_' + w + '" class="sig-flow-path bat-color"   d="M158,125 Q242,125 242,71"  marker-end="url(#mBat_' + w + ')"/>' +
            '<path id="sig_path_grid_buy_' + w + '" class="sig-flow-path grid-color"  d="M58,191 Q58,125  142,125" marker-end="url(#mGrid_' + w + ')"/>' +
            '<path id="sig_path_grid_exp_' + w + '" class="sig-flow-path grid-color"  d="M142,125 Q58,125  58,191"  marker-end="url(#mGrid_' + w + ')"/>' +
            '<path id="sig_path_house_'+ w + '" class="sig-flow-path house-color" d="M158,125 Q242,125 242,191" marker-end="url(#mHouse_'+ w + ')"/>' +

            // ── Hub-Kreis Mitte ───────────────────────────────────────────
            '<circle cx="150" cy="125" r="18" fill="' + (dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)') + '"/>' +
            '<text x="150" y="125" text-anchor="middle" dominant-baseline="central" font-size="18" fill="' + tc + '" opacity="0.85">&#9889;</text>' +

            // ── Solar PV  (oben-links, Knotenmitte 58, 42) ───────────────
            '<text x="58" y="28"  text-anchor="middle" dominant-baseline="central" font-size="20" fill="#f39c12">&#9728;</text>' +
            '<text x="58" y="45"  text-anchor="middle" dominant-baseline="central" font-size="8.5" fill="' + tc + '" opacity="0.65">Solar PV</text>' +
            '<text id="sig_ef_pv_'   + w + '" x="58" y="57" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill="#f39c12">-- kW</text>' +

            // ── Batterie  (oben-rechts, Knotenmitte 242, 42) ─────────────
            // SOC-Anzeige links neben dem Batterie-Icon
            '<text x="202" y="18" text-anchor="middle" dominant-baseline="central" font-size="8" fill="' + tc + '" opacity="0.65">SOC</text>' +
            '<text id="sig_ef_socval_'+ w + '" x="202" y="31" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="#9b59b6">--%</text>' +
            // Batterie-Icon als SVG: Rahmen + dynamische Füllung + Pol
            '<rect x="229" y="21" width="22" height="14" rx="2" fill="none" stroke="#9b59b6" stroke-width="1.5"/>' +
            '<rect x="251" y="24" width="3" height="8" rx="1" fill="#9b59b6"/>' +
            '<rect id="sig_ef_batfill_'+ w + '" x="230" y="22" width="11" height="12" rx="1" fill="#9b59b6"/>' +
            '<text x="242" y="45" text-anchor="middle" dominant-baseline="central" font-size="8.5" fill="' + tc + '" opacity="0.65">Batterie</text>' +
            '<text id="sig_ef_bat_'  + w + '" x="242" y="57" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill="#9b59b6">-- kW</text>' +

            // ── Netz  (unten-links, Knotenmitte 58, 208) ─────────────────
            '<text x="58" y="197" text-anchor="middle" dominant-baseline="central" font-size="20" fill="#3498db">&#128268;</text>' +
            '<text x="58" y="214" text-anchor="middle" dominant-baseline="central" font-size="8.5" fill="' + tc + '" opacity="0.65">Netz</text>' +
            '<text id="sig_ef_grid_' + w + '" x="58" y="226" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill="#3498db">-- kW</text>' +

            // ── Haus  (unten-rechts, Knotenmitte 242, 208) ───────────────
            '<text x="242" y="197" text-anchor="middle" dominant-baseline="central" font-size="20" fill="#27ae60">&#127968;</text>' +
            '<text x="242" y="214" text-anchor="middle" dominant-baseline="central" font-size="8.5" fill="' + tc + '" opacity="0.65">Haus</text>' +
            '<text id="sig_ef_house_'+ w + '" x="242" y="226" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill="#27ae60">-- kW</text>' +

            '</svg>';

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            '<div class="sig-ef-title">&#9889; ' + title + '</div>' +
            '<div class="sig-ef-svg-wrap">' + svg + '</div>' +
            '</div></div>'
        );

        function update() {
            var pv   = parseFloat(B._val(data, "oid_pv"))    || 0;
            var bat  = parseFloat(B._val(data, "oid_bat"))   || 0;
            var grid = parseFloat(B._val(data, "oid_grid"))  || 0;
            var hous = parseFloat(B._val(data, "oid_house")) || 0;
            var soc  = parseFloat(B._val(data, "oid_soc"))   || 0;

            // Werte setzen (SVG-Text-Knoten)
            B._txt("sig_ef_pv_"    + w, B._fmtKW(pv));
            B._txt("sig_ef_bat_"   + w, B._fmtKW(bat));
            B._txt("sig_ef_grid_"  + w, B._fmtKW(grid));
            B._txt("sig_ef_house_" + w, B._fmtKW(hous));

            // Netz-Farbe: grün = Einspeisung, rot = Bezug
            B._css("sig_ef_grid_"    + w, "fill", grid < 0 ? "#27ae60" : "#e74c3c");
            // Batterie-SOC: Wert links + Icon-Füllung dynamisch
            B._txt("sig_ef_socval_" + w, Math.round(soc) + " %");
            B._css("sig_ef_socval_" + w, "fill", B._socCol(soc));
            var batfill = B._el("sig_ef_batfill_" + w);
            if (batfill) {
                var fw = Math.max(1, Math.round(soc / 100 * 20));
                batfill.setAttribute("width", String(fw));
                batfill.setAttribute("fill", B._socCol(soc));
            }

            // Pfade aktivieren/deaktivieren → startet/stoppt CSS-Dash-Animation
            var paths = ["pv", "house"];
            var vals  = [pv, hous];
            for (var i = 0; i < paths.length; i++) {
                var el = B._el("sig_path_" + paths[i] + "_" + w);
                if (el) {
                    if (Math.abs(vals[i]) > 0.05) el.classList.add("active");
                    else                           el.classList.remove("active");
                }
            }
            // Batterie – zwei separate Pfade je Richtung:
            // sig_path_bat_dis: Battery→Mitte (Entladen, bat < 0)
            // sig_path_bat_chg: Mitte→Battery (Laden,    bat > 0)
            var batDis = B._el("sig_path_bat_dis_" + w);
            var batChg = B._el("sig_path_bat_chg_" + w);
            if (batDis && batChg) {
                if (bat < -0.05) {
                    // Entladen: Entlade-Pfad aktiv, Lade-Pfad inaktiv
                    batDis.classList.add("active");
                    batChg.classList.remove("active");
                } else if (bat > 0.05) {
                    // Laden: Lade-Pfad aktiv, Entlade-Pfad inaktiv
                    batChg.classList.add("active");
                    batDis.classList.remove("active");
                } else {
                    // Inaktiv: beide aus
                    batDis.classList.remove("active");
                    batChg.classList.remove("active");
                }
            }
            // Netz – zwei separate Pfade je Richtung:
            // sig_path_grid_buy: Netz→Mitte  (Netzbezug,    grid > 0)
            // sig_path_grid_exp: Mitte→Netz  (Einspeisung,  grid < 0)
            var gridBuy = B._el("sig_path_grid_buy_" + w);
            var gridExp = B._el("sig_path_grid_exp_" + w);
            if (gridBuy && gridExp) {
                if (grid > 0.05) {
                    // Netzbezug: Netz→Mitte aktiv
                    gridBuy.classList.add("active");
                    gridExp.classList.remove("active");
                } else if (grid < -0.05) {
                    // Einspeisung: Mitte→Netz aktiv
                    gridExp.classList.add("active");
                    gridBuy.classList.remove("active");
                } else {
                    // Inaktiv: beide aus
                    gridBuy.classList.remove("active");
                    gridExp.classList.remove("active");
                }
            }
        }
        B._subscribe(widgetID, data, ["oid_pv", "oid_bat", "oid_grid", "oid_house", "oid_soc"], update);
        update();
    },

    // ── Widget 2: Akku-Status & Prognosen ───────────────────────────────────
    createBatteryStatus: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createBatteryStatus(widgetID, view, data, style); }, 100);
        }

        var dark = B._isDark(data);
        var cls  = "sig-bat-wrap" + (dark ? "" : " light");
        var w    = widgetID;

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            '<div class="sig-bat-head"><span class="icon">&#128267;</span><span class="title">Batterie Status</span>' +
            '<span class="sig-bat-soh" id="sig_bat_soh_' + w + '">SOH: --%</span></div>' +
            '<div class="sig-soc-big" id="sig_bat_soc_' + w + '">--%</div>' +
            '<div class="sig-soc-bar-bg"><div class="sig-soc-bar-fill" id="sig_bat_bar_' + w + '" style="width:0%"></div></div>' +
            '<div class="sig-soc-labels"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>' +
            '<div class="sig-bat-stats">' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#9889; Leistung</div><div class="sig-stat-val" id="sig_bat_pow_' + w + '">--</div></div>' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#8987; Bis Voll</div><div class="sig-stat-val" id="sig_bat_ttf_' + w + '">--</div></div>' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#9203; Restlaufzeit</div><div class="sig-stat-val" id="sig_bat_ttr_' + w + '">--</div></div>' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#9728; Eigenverbrauch</div><div class="sig-stat-val" id="sig_bat_sc_' + w + '">--</div></div>' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#127969; Autarkierate</div><div class="sig-stat-val" id="sig_bat_aut_' + w + '">--</div></div>' +
            '</div></div></div>'
        );

        function update() {
            var soc = parseFloat(B._val(data, "oid_soc")) || 0;
            var col = B._socCol(soc);
            B._txt("sig_bat_soh_" + w, "SOH: " + B._fmtPct(B._val(data, "oid_soh")));
            B._txt("sig_bat_soc_" + w, B._fmtPct(soc));
            B._css("sig_bat_soc_" + w, "color", col);
            var bar = B._el("sig_bat_bar_" + w);
            if (bar) { bar.style.width = Math.min(100, soc) + "%"; bar.style.background = col; }
            var bat = parseFloat(B._val(data, "oid_bat")) || 0;
            B._txt("sig_bat_pow_" + w, B._fmtKW(bat));
            B._css("sig_bat_pow_" + w, "color", bat >= 0 ? "#27ae60" : "#e74c3c");
            B._txt("sig_bat_ttf_" + w, B._fmtMin(B._val(data, "oid_ttf")));
            B._txt("sig_bat_ttr_" + w, B._fmtMin(B._val(data, "oid_ttr")));
            B._txt("sig_bat_sc_"  + w, B._fmtPct(B._val(data, "oid_sc")));
            B._txt("sig_bat_aut_" + w, B._fmtPct(B._val(data, "oid_aut")));
        }
        B._subscribe(widgetID, data, ["oid_soc", "oid_soh", "oid_bat", "oid_ttf", "oid_ttr", "oid_sc", "oid_aut"], update);
        update();
    },

    // ── Widget 3: Echtzeit-Leistung ─────────────────────────────────────────
    createPowerOverview: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createPowerOverview(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "Live Leistung";
        var cls   = "sig-pow-wrap" + (dark ? "" : " light");
        var w     = widgetID;

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            '<div class="sig-pow-title"><div class="sig-live-dot"></div>' + title + '</div>' +
            '<div class="sig-pow-row"><div class="sig-pow-left"><div class="sig-dot" style="background:#f39c12"></div>&#9728; Solar PV</div><div class="sig-pow-val" id="sig_pow_pv_'    + w + '">-- kW</div></div>' +
            '<div class="sig-pow-row"><div class="sig-pow-left"><div class="sig-dot" style="background:#9b59b6"></div>&#128267; Batterie</div><div class="sig-pow-val" id="sig_pow_bat_'   + w + '">-- kW</div></div>' +
            '<div class="sig-pow-row"><div class="sig-pow-left"><div class="sig-dot" style="background:#3498db"></div>&#128268; Netz</div><div class="sig-pow-val" id="sig_pow_grid_'  + w + '">-- kW</div></div>' +
            '<div class="sig-pow-row"><div class="sig-pow-left"><div class="sig-dot" style="background:#27ae60"></div>&#127968; Haus</div><div class="sig-pow-val" id="sig_pow_house_' + w + '">-- kW</div></div>' +
            '<div class="sig-pow-row" style="border-top:1px solid rgba(128,128,128,.15);margin-top:6px;padding-top:6px;">' +
            '<div class="sig-pow-left"><div class="sig-dot" style="background:#8e44ad"></div>&#128267; SOC</div>' +
            '<div class="sig-pow-val" id="sig_pow_soc_' + w + '">--%</div></div>' +
            '</div></div>'
        );

        function update() {
            var bat  = parseFloat(B._val(data, "oid_bat"))  || 0;
            var grid = parseFloat(B._val(data, "oid_grid")) || 0;
            var soc  = B._val(data, "oid_soc");
            B._txt("sig_pow_pv_"    + w, B._fmtKW(B._val(data, "oid_pv")));
            B._txt("sig_pow_bat_"   + w, B._fmtKW(bat));
            B._css("sig_pow_bat_"   + w, "color", bat  < 0 ? "#e74c3c" : "#27ae60");
            B._txt("sig_pow_grid_"  + w, B._fmtKW(grid));
            B._css("sig_pow_grid_"  + w, "color", grid < 0 ? "#27ae60" : "#e74c3c");
            B._txt("sig_pow_house_" + w, B._fmtKW(B._val(data, "oid_house")));
            B._txt("sig_pow_soc_"   + w, B._fmtPct(soc));
            B._css("sig_pow_soc_"   + w, "color", B._socCol(soc));
        }
        B._subscribe(widgetID, data, ["oid_pv", "oid_bat", "oid_grid", "oid_house", "oid_soc"], update);
        update();
    },

    // ── Widget 4: Energiestatistiken ────────────────────────────────────────
    createStatistics: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createStatistics(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "Tagesstatistik";
        var cls   = "sig-stats-wrap" + (dark ? " dark" : "");
        var w     = widgetID;

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            '<div class="sig-stats-title">&#128202; ' + title + '</div>' +
            '<div class="sig-stats-grid">' +
            '<div class="sig-stats-item"><div class="s-label">&#127969; Autarkierate</div><div class="s-value" style="color:#27ae60" id="sig_st_aut_'    + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#8635; Eigenverbrauch</div><div class="s-value" style="color:#9b59b6" id="sig_st_sc_'     + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#8593; Max SOC heute</div><div class="s-value" style="color:#f39c12" id="sig_st_maxsoc_'  + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#8595; Min SOC heute</div><div class="s-value" style="color:#3498db" id="sig_st_minsoc_'  + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#11014; Tages-Ladung</div><div class="s-value" style="color:#16a085" id="sig_st_chg_'    + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#11015; Tages-Entladung</div><div class="s-value" style="color:#e74c3c" id="sig_st_dchg_' + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#8987; Batteriedeckung</div><div class="s-value" style="color:#8e44ad" id="sig_st_cov_'   + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#9889; Ladezeit heute</div><div class="s-value" style="color:#c0392b" id="sig_st_cht_'    + w + '">--</div></div>' +
            '</div></div></div>'
        );

        function update() {
            B._txt("sig_st_aut_"    + w, B._fmtPct(B._val(data, "oid_aut")));
            B._txt("sig_st_sc_"     + w, B._fmtPct(B._val(data, "oid_sc")));
            B._txt("sig_st_maxsoc_" + w, B._fmtPct(B._val(data, "oid_maxsoc")));
            B._txt("sig_st_minsoc_" + w, B._fmtPct(B._val(data, "oid_minsoc")));
            B._txt("sig_st_chg_"    + w, B._fmtKWh(B._val(data, "oid_charg")));
            B._txt("sig_st_dchg_"   + w, B._fmtKWh(B._val(data, "oid_discharg")));
            B._txt("sig_st_cov_"    + w, B._fmtMin(B._val(data, "oid_covtime")));
            B._txt("sig_st_cht_"    + w, B._fmtMin(B._val(data, "oid_chargt")));
        }
        B._subscribe(widgetID, data, ["oid_aut", "oid_sc", "oid_maxsoc", "oid_minsoc", "oid_charg", "oid_discharg", "oid_covtime", "oid_chargt"], update);
        update();
    },

    // ── Widget 5: AC-Charger (Sigen EVAC) ───────────────────────────────────
    //
    // Systemzustände (IEC 61851-1):
    //   0 = Standby (nicht verbunden)
    //   1 = Warte auf Fahrzeug
    //   2 = Lädt
    //   3 = Laden abgeschlossen / Fehler
    //
    // Steuerung:
    //   acCharger.control.startStop   0=Start, 1=Stop  (WO)
    //   acCharger.control.outputCurrent  6..rated A    (RW)
    //
    createAcCharger: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createAcCharger(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "AC-Charger";
        var cls   = "sig-ac-wrap" + (dark ? "" : " light");
        var w     = widgetID;

        // Systemzustand → lesbarer Text + Badge-Klasse
        function stateInfo(v) {
            var n = parseInt(v);
            switch (n) {
                case 0: return { label: "Bereit",     badge: "idle" };
                case 1: return { label: "Verbunden",  badge: "idle" };
                case 2: return { label: "Lädt",       badge: "charging" };
                case 3: return { label: "Fertig",     badge: "idle" };
                default:return { label: "Unbekannt",  badge: "error" };
            }
        }

        // Alarm-Text: 0 = kein Alarm
        function alarmText(a1, a2, a3) {
            var v = (parseInt(a1) || 0) | (parseInt(a2) || 0) | (parseInt(a3) || 0);
            return v ? "⚠ Alarm " + v.toString(16).toUpperCase() : "OK";
        }

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            // ── Kopfzeile ──────────────────────────────────────────────
            '<div class="sig-ac-head">' +
            '<span class="icon">&#128268;</span>' +
            '<span class="title">' + title + '</span>' +
            '<span class="sig-ac-badge idle" id="sig_ac_badge_' + w + '">Bereit</span>' +
            '</div>' +
            // ── Ladeleistung groß ────────────────────────────────────
            '<div class="sig-ac-power-big" id="sig_ac_power_' + w + '">-- kW</div>' +
            '<div class="sig-ac-power-lbl">Ladeleistung</div>' +
            // ── Statistik-Kacheln ────────────────────────────────────
            '<div class="sig-ac-stats">' +
            '<div class="sig-ac-stat-box"><div class="sig-ac-stat-lbl">Nennleistung</div><div class="sig-ac-stat-val" id="sig_ac_rp_' + w + '" style="color:#f39c12">-- kW</div></div>' +
            '<div class="sig-ac-stat-box"><div class="sig-ac-stat-lbl">Nennstrom</div><div class="sig-ac-stat-val" id="sig_ac_rc_' + w + '" style="color:#f39c12">-- A</div></div>' +
            '<div class="sig-ac-stat-box"><div class="sig-ac-stat-lbl">Gesamtenergie</div><div class="sig-ac-stat-val" id="sig_ac_en_' + w + '" style="color:#27ae60">-- kWh</div></div>' +
            '<div class="sig-ac-stat-box"><div class="sig-ac-stat-lbl">Alarm</div><div class="sig-ac-stat-val" id="sig_ac_alm_' + w + '" style="color:#27ae60">--</div></div>' +
            '</div>' +
            // ── Steuerung ────────────────────────────────────────────
            '<div class="sig-ac-ctrl">' +
            '<div class="sig-ac-ctrl-lbl">Steuerung</div>' +
            '<div class="sig-ac-btn-row">' +
            '<button class="sig-ac-btn start" id="sig_ac_start_' + w + '">&#9654; Start</button>' +
            '<button class="sig-ac-btn stop"  id="sig_ac_stop_'  + w + '">&#9646;&#9646; Stop</button>' +
            '</div>' +
            '<div class="sig-ac-slider-row">' +
            '<span class="sig-ac-slider-lbl">Ladestrom:</span>' +
            '<input type="range" class="sig-ac-slider" id="sig_ac_slider_' + w + '" min="6" max="32" step="1" value="16">' +
            '<span class="sig-ac-slider-val" id="sig_ac_slider_val_' + w + '">16 A</span>' +
            '</div>' +
            '</div>' +
            '</div></div>'
        );

        // ── Anzeige aktualisieren ────────────────────────────────────────────
        function update() {
            var state = B._val(data, "oid_state");
            var si    = stateInfo(state);
            var badge = B._el("sig_ac_badge_" + w);
            if (badge) { badge.textContent = si.label; badge.className = "sig-ac-badge " + si.badge; }

            var pwr   = parseFloat(B._val(data, "oid_power")) || 0;
            B._txt("sig_ac_power_"   + w, B._fmtKW(pwr));
            B._css("sig_ac_power_"   + w, "color", pwr > 0.05 ? "#3498db" : (dark ? "#e0e6ef" : "#2c3e50"));

            var rp    = parseFloat(B._val(data, "oid_ratedPower"))   || 0;
            var rc    = parseFloat(B._val(data, "oid_ratedCurrent")) || 0;
            var en    = parseFloat(B._val(data, "oid_energy"))       || 0;
            B._txt("sig_ac_rp_"      + w, rp ? rp.toFixed(1) + " kW" : "-- kW");
            B._txt("sig_ac_rc_"      + w, rc ? Math.round(rc) + " A" : "-- A");
            B._txt("sig_ac_en_"      + w, en ? en.toFixed(1) + " kWh" : "-- kWh");

            var a1 = B._val(data, "oid_alarm1");
            var a2 = B._val(data, "oid_alarm2");
            var a3 = B._val(data, "oid_alarm3");
            var alTxt = alarmText(a1, a2, a3);
            B._txt("sig_ac_alm_"     + w, alTxt);
            B._css("sig_ac_alm_"     + w, "color", alTxt === "OK" ? "#27ae60" : "#e74c3c");

            // Ladestrom-Slider: Aktuellen Wert anzeigen
            var curOid = data.attr("oid_current");
            if (curOid) {
                var curVal = parseFloat(vis.states[curOid + ".val"]) || 16;
                var slider = B._el("sig_ac_slider_" + w);
                if (slider && !slider._dragging) {
                    slider.value = Math.round(curVal);
                    B._txt("sig_ac_slider_val_" + w, Math.round(curVal) + " A");
                }
            }

            // Start/Stop-Button Zustand hervorheben
            var ssOid  = data.attr("oid_startStop");
            var ssVal  = ssOid ? parseInt(vis.states[ssOid + ".val"]) : null;
            var btnStart = B._el("sig_ac_start_" + w);
            var btnStop  = B._el("sig_ac_stop_"  + w);
            if (btnStart && btnStop) {
                btnStart.classList.toggle("active-state", ssVal === 0);
                btnStop.classList.toggle("active-state",  ssVal === 1);
            }
        }

        // ── Steuer-Events ────────────────────────────────────────────────────
        var startBtn = B._el("sig_ac_start_" + w);
        var stopBtn  = B._el("sig_ac_stop_"  + w);
        var slider   = B._el("sig_ac_slider_" + w);
        var sliderLbl= B._el("sig_ac_slider_val_" + w);

        if (startBtn) {
            startBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (oid) vis.setValue(oid, 0);
            });
        }
        if (stopBtn) {
            stopBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (oid) vis.setValue(oid, 1);
            });
        }
        if (slider && sliderLbl) {
            slider.addEventListener("input", function () {
                sliderLbl.textContent = slider.value + " A";
            });
            slider.addEventListener("mousedown",  function () { slider._dragging = true;  });
            slider.addEventListener("touchstart", function () { slider._dragging = true;  });
            slider.addEventListener("mouseup",    function () {
                slider._dragging = false;
                var oid = data.attr("oid_current");
                if (oid) vis.setValue(oid, parseFloat(slider.value));
            });
            slider.addEventListener("touchend",   function () {
                slider._dragging = false;
                var oid = data.attr("oid_current");
                if (oid) vis.setValue(oid, parseFloat(slider.value));
            });
        }

        B._subscribe(widgetID, data,
            ["oid_state", "oid_power", "oid_energy", "oid_ratedPower", "oid_ratedCurrent",
             "oid_alarm1", "oid_alarm2", "oid_alarm3", "oid_startStop", "oid_current"],
            update);
        update();
    },

    // ── Widget 6: DC-Charger ─────────────────────────────────────────────────
    //
    // Lese-OIDs:
    //   dcCharger.outputPower                Ausgangsleistung  kW
    //   dcCharger.vehicleSoc                 Fahrzeug-SOC      %
    //   dcCharger.vehicleBatteryVoltage      Fahrzeugbatterie  V
    //   dcCharger.chargingCurrent            Ladestrom         A
    //   dcCharger.currentChargingCapacity    Sitzungsenergie   kWh
    //   dcCharger.currentChargingDuration    Sitzungsdauer     s
    //
    // Steuer-OID:
    //   dcCharger.control.startStop          0=Start, 1=Stop   WO
    //
    createDcCharger: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createDcCharger(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "DC-Charger";
        var cls   = "sig-dc-wrap" + (dark ? "" : " light");
        var w     = widgetID;

        // Dauer in Sekunden → "Xh Ym" oder "Ym"
        function fmtDuration(sec) {
            var s = Math.round(Math.abs(parseFloat(sec) || 0));
            if (!s) return "0 min";
            var h = Math.floor(s / 3600);
            var m = Math.floor((s % 3600) / 60);
            return h ? h + "h " + m + "m" : m + " min";
        }

        // Fahrzeug-SOC → Farbe
        function vsocCol(p) {
            return parseFloat(p) > 60 ? "#27ae60" : parseFloat(p) > 25 ? "#f39c12" : "#e74c3c";
        }

        // Ladestatustext aus Leistung ableiten (kein eigenes State-Register)
        function badgeInfo(pwr) {
            if (pwr > 0.05) return { label: "Lädt",    cls: "charging" };
            if (pwr < 0)    return { label: "Fehler",  cls: "error" };
            return              { label: "Bereit",  cls: "idle" };
        }

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            // ── Kopfzeile ────────────────────────────────────────────
            '<div class="sig-dc-head">' +
            '<span class="icon">&#9889;</span>' +
            '<span class="title">' + title + '</span>' +
            '<span class="sig-dc-badge idle" id="sig_dc_badge_' + w + '">Bereit</span>' +
            '</div>' +
            // ── Leistung groß ─────────────────────────────────────
            '<div class="sig-dc-power-big" id="sig_dc_power_' + w + '">-- kW</div>' +
            '<div class="sig-dc-power-lbl">Ausgangsleistung</div>' +
            // ── Fahrzeug-SOC Balken ───────────────────────────────
            '<div class="sig-dc-soc-row">' +
            '<span class="sig-dc-soc-lbl">&#128664; Fahrzeug SOC</span>' +
            '<span class="sig-dc-soc-val" id="sig_dc_vsoc_' + w + '">--%</span>' +
            '</div>' +
            '<div class="sig-dc-soc-bar-bg">' +
            '<div class="sig-dc-soc-bar-fill" id="sig_dc_bar_' + w + '" style="width:0%;background:#27ae60"></div>' +
            '</div>' +
            // ── Statistik-Kacheln ─────────────────────────────────
            '<div class="sig-dc-stats">' +
            '<div class="sig-dc-stat-box"><div class="sig-dc-stat-lbl">Spannung</div><div class="sig-dc-stat-val" id="sig_dc_volt_' + w + '" style="color:#3498db">-- V</div></div>' +
            '<div class="sig-dc-stat-box"><div class="sig-dc-stat-lbl">Strom</div><div class="sig-dc-stat-val" id="sig_dc_curr_' + w + '" style="color:#3498db">-- A</div></div>' +
            '<div class="sig-dc-stat-box"><div class="sig-dc-stat-lbl">Sitzungsenergie</div><div class="sig-dc-stat-val" id="sig_dc_en_' + w + '" style="color:#9b59b6">-- kWh</div></div>' +
            '<div class="sig-dc-stat-box"><div class="sig-dc-stat-lbl">Sitzungsdauer</div><div class="sig-dc-stat-val" id="sig_dc_dur_' + w + '" style="color:#9b59b6">--</div></div>' +
            '</div>' +
            // ── Steuerung ─────────────────────────────────────────
            '<div class="sig-dc-ctrl">' +
            '<div class="sig-dc-ctrl-lbl">Steuerung</div>' +
            '<div class="sig-dc-btn-row">' +
            '<button class="sig-dc-btn start" id="sig_dc_start_' + w + '">&#9654; Start</button>' +
            '<button class="sig-dc-btn stop"  id="sig_dc_stop_'  + w + '">&#9646;&#9646; Stop</button>' +
            '</div>' +
            '</div>' +
            '</div></div>'
        );

        // ── Anzeige aktualisieren ───────────────────────────────────────────
        function update() {
            var pwr  = parseFloat(B._val(data, "oid_power"))    || 0;
            var vsoc = parseFloat(B._val(data, "oid_vsoc"))     || 0;
            var volt = parseFloat(B._val(data, "oid_vvolt"))    || 0;
            var curr = parseFloat(B._val(data, "oid_curr"))     || 0;
            var en   = parseFloat(B._val(data, "oid_energy"))   || 0;
            var dur  = parseFloat(B._val(data, "oid_duration")) || 0;

            // Badge
            var bi = badgeInfo(pwr);
            var badge = B._el("sig_dc_badge_" + w);
            if (badge) { badge.textContent = bi.label; badge.className = "sig-dc-badge " + bi.cls; }

            // Leistung
            B._txt("sig_dc_power_" + w, B._fmtKW(pwr));
            B._css("sig_dc_power_" + w, "color", pwr > 0.05 ? "#f39c12" : (dark ? "#e0e6ef" : "#2c3e50"));

            // Fahrzeug-SOC
            var col = vsocCol(vsoc);
            B._txt("sig_dc_vsoc_" + w, B._fmtPct(vsoc));
            B._css("sig_dc_vsoc_" + w, "color", col);
            var bar = B._el("sig_dc_bar_" + w);
            if (bar) { bar.style.width = Math.min(100, vsoc) + "%"; bar.style.background = col; }

            // Kacheln
            B._txt("sig_dc_volt_" + w, volt ? volt.toFixed(0) + " V"   : "-- V");
            B._txt("sig_dc_curr_" + w, curr ? curr.toFixed(1) + " A"   : "-- A");
            B._txt("sig_dc_en_"   + w, en   ? en.toFixed(2)   + " kWh" : "-- kWh");
            B._txt("sig_dc_dur_"  + w, dur  ? fmtDuration(dur)         : "--");

            // Start/Stop-Buttons hervorheben
            var ssOid    = data.attr("oid_startStop");
            var ssVal    = ssOid ? parseInt(vis.states[ssOid + ".val"]) : null;
            var btnStart = B._el("sig_dc_start_" + w);
            var btnStop  = B._el("sig_dc_stop_"  + w);
            if (btnStart && btnStop) {
                btnStart.classList.toggle("active-state", ssVal === 0);
                btnStop.classList.toggle("active-state",  ssVal === 1);
            }
        }

        // ── Steuer-Events ───────────────────────────────────────────────────
        var startBtn = B._el("sig_dc_start_" + w);
        var stopBtn  = B._el("sig_dc_stop_"  + w);

        if (startBtn) {
            startBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (oid) vis.setValue(oid, 0);
            });
        }
        if (stopBtn) {
            stopBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (oid) vis.setValue(oid, 1);
            });
        }

        B._subscribe(widgetID, data,
            ["oid_power", "oid_vsoc", "oid_vvolt", "oid_curr",
             "oid_energy", "oid_duration", "oid_startStop"],
            update);
        update();
    },

    // ── Widget 7: Inverter ───────────────────────────────────────────────────
    //
    // Tabs: Leistung | Batterie | Netz | Alarme | Info
    //
    // runningState: 0=Standby, 1=Running, 2=Fault, 3=Shutdown
    // control.startStop: 0=Stop, 1=Start  (ACHTUNG: invertiert zu Charger-Widgets!)
    //
    createInverter: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createInverter(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "Inverter";
        var cls   = "sig-inv-wrap" + (dark ? "" : " light");
        var w     = widgetID;

        // Betriebsstatus-Mapping
        function stateInfo(v) {
            switch (parseInt(v)) {
                case 0: return { label: "Standby",  cls: "standby"  };
                case 1: return { label: "Running",  cls: "running"  };
                case 2: return { label: "Fault",    cls: "fault"    };
                case 3: return { label: "Shutdown", cls: "shutdown" };
                default:return { label: "–",        cls: "standby"  };
            }
        }

        // Temperaturfarbe
        function tempCol(t) {
            var v = parseFloat(t);
            return v > 50 ? "#e74c3c" : v > 35 ? "#f39c12" : "#27ae60";
        }

        // Alarm-Darstellung: 0 = OK
        function almInfo(v) {
            var n = parseInt(v) || 0;
            return n === 0
                ? { text: "OK",          cls: "ok",    valCls: "ok"    }
                : { text: "0x" + n.toString(16).toUpperCase(), cls: "error", valCls: "error" };
        }

        // ── HTML aufbauen ────────────────────────────────────────────────────
        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +

            // Kopfzeile
            '<div class="sig-inv-head">' +
            '<span class="icon">&#9889;</span>' +
            '<span class="title">' + title + '</span>' +
            '<span class="sig-inv-badge standby" id="si_badge_' + w + '">–</span>' +
            '<button class="sig-inv-startstop" id="si_ss_btn_' + w + '">Start</button>' +
            '</div>' +

            // Tab-Leiste
            '<div class="sig-inv-tabs">' +
            '<div class="sig-inv-tab active" data-tab="power"  id="si_t0_' + w + '">Leistung</div>' +
            '<div class="sig-inv-tab"        data-tab="bat"    id="si_t1_' + w + '">Batterie</div>' +
            '<div class="sig-inv-tab"        data-tab="grid"   id="si_t2_' + w + '">Netz</div>' +
            '<div class="sig-inv-tab"        data-tab="alarms" id="si_t3_' + w + '">Alarme</div>' +
            '<div class="sig-inv-tab"        data-tab="info"   id="si_t4_' + w + '">Info</div>' +
            '</div>' +

            // ── Tab 0: Leistung ──────────────────────────────────────────────
            '<div class="sig-inv-panel active" id="si_p0_' + w + '">' +
            '<div class="sig-inv-row2">' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Wirkleistung</div><div class="sig-inv-box-val" id="si_apwr_' + w + '" style="color:#3498db">-- kW</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">PV-Leistung</div><div class="sig-inv-box-val" id="si_pv_' + w + '" style="color:#f39c12">-- kW</div></div>' +
            '</div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Batterie Laden/Entladen</div><div class="sig-inv-box-val" id="si_esspwr_' + w + '" style="color:#9b59b6">-- kW</div><div class="sig-inv-box-sub" id="si_ess_dir_' + w + '"></div></div>' +
            '<div class="sig-inv-box">' +
            '<div class="sig-inv-box-lbl" style="margin-bottom:5px">Leistungsanteil EMS</div>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
            '<input type="range" style="flex:1;accent-color:#3498db" min="-100" max="100" step="1" value="0" id="si_pct_sl_' + w + '">' +
            '<span class="sig-inv-ctrl-val" id="si_pct_lbl_' + w + '">–</span>' +
            '</div>' +
            '</div>' +
            '</div>' +

            // ── Tab 1: Batterie ───────────────────────────────────────────────
            '<div class="sig-inv-panel" id="si_p1_' + w + '">' +
            '<div class="sig-inv-row2">' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">SOC</div><div class="sig-inv-box-val" id="si_soc_' + w + '">--%</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">SOH</div><div class="sig-inv-box-val" id="si_soh_' + w + '">--%</div></div>' +
            '</div>' +
            '<div class="sig-inv-box">' +
            '<div class="sig-inv-box-lbl" style="margin-bottom:5px">SOC-Verlauf</div>' +
            '<div class="sig-inv-soc-bar-bg"><div class="sig-inv-soc-bar-fill" id="si_soc_bar_' + w + '" style="width:0%;background:#27ae60"></div></div>' +
            '</div>' +
            '<div class="sig-inv-temp-grid">' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">&#127777; Ø Zelltemp.</div><div class="sig-inv-box-val" id="si_ct_' + w + '">-- °C</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Ø Zellspannung</div><div class="sig-inv-box-val" id="si_cv_' + w + '" style="color:#3498db">-- V</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">&#127777; Max Temp.</div><div class="sig-inv-box-val" id="si_tmax_' + w + '">-- °C</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">&#127777; Min Temp.</div><div class="sig-inv-box-val" id="si_tmin_' + w + '">-- °C</div></div>' +
            '</div>' +
            '</div>' +

            // ── Tab 2: Netz ───────────────────────────────────────────────────
            '<div class="sig-inv-panel" id="si_p2_' + w + '">' +
            '<div class="sig-inv-phase-row">' +
            '<div class="sig-inv-phase-box"><div class="sig-inv-phase-lbl">L1</div><div class="sig-inv-phase-val" id="si_uA_' + w + '">-- V</div></div>' +
            '<div class="sig-inv-phase-box"><div class="sig-inv-phase-lbl">L2</div><div class="sig-inv-phase-val" id="si_uB_' + w + '">-- V</div></div>' +
            '<div class="sig-inv-phase-box"><div class="sig-inv-phase-lbl">L3</div><div class="sig-inv-phase-val" id="si_uC_' + w + '">-- V</div></div>' +
            '</div>' +
            '<div class="sig-inv-row2">' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Netzfrequenz</div><div class="sig-inv-box-val" id="si_freq_' + w + '" style="color:#3498db">-- Hz</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Leistungsfaktor</div><div class="sig-inv-box-val" id="si_pf_' + w + '" style="color:#3498db">--</div></div>' +
            '</div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">&#127777; PCS-Innentemperatur</div><div class="sig-inv-box-val" id="si_pcs_t_' + w + '">-- °C</div></div>' +
            '</div>' +

            // ── Tab 3: Alarme ──────────────────────────────────────────────────
            '<div class="sig-inv-panel" id="si_p3_' + w + '">' +
            '<div class="sig-inv-alm-row ok" id="si_alm1row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 1 (PCS)</span><span class="sig-inv-alm-val ok" id="si_alm1_' + w + '">–</span></div>' +
            '<div class="sig-inv-alm-row ok" id="si_alm2row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 2 (PCS)</span><span class="sig-inv-alm-val ok" id="si_alm2_' + w + '">–</span></div>' +
            '<div class="sig-inv-alm-row ok" id="si_alm3row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 3 (ESS)</span><span class="sig-inv-alm-val ok" id="si_alm3_' + w + '">–</span></div>' +
            '<div class="sig-inv-alm-row ok" id="si_alm4row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 4 (Gateway)</span><span class="sig-inv-alm-val ok" id="si_alm4_' + w + '">–</span></div>' +
            '<div class="sig-inv-alm-row ok" id="si_alm5row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 5 (DC-Charger)</span><span class="sig-inv-alm-val ok" id="si_alm5_' + w + '">–</span></div>' +
            '</div>' +

            // ── Tab 4: Info ────────────────────────────────────────────────────
            '<div class="sig-inv-panel" id="si_p4_' + w + '">' +
            '<div class="sig-inv-info-row"><div class="sig-inv-info-lbl">Modell</div><div class="sig-inv-info-val" id="si_model_' + w + '">–</div></div>' +
            '<div class="sig-inv-info-row"><div class="sig-inv-info-lbl">Seriennummer</div><div class="sig-inv-info-val" id="si_serial_' + w + '">–</div></div>' +
            '<div class="sig-inv-info-row"><div class="sig-inv-info-lbl">Firmware</div><div class="sig-inv-info-val" id="si_fw_' + w + '">–</div></div>' +
            '<div class="sig-inv-ctrl-row">' +
            '<span class="sig-inv-ctrl-lbl">Remote EMS</span>' +
            '<button class="sig-inv-toggle off" id="si_ems_btn_' + w + '">Inaktiv</button>' +
            '</div>' +
            '</div>' +

            '</div></div>'
        );

        // ── Tab-Umschaltung ──────────────────────────────────────────────────
        var tabs   = ["si_t0_", "si_t1_", "si_t2_", "si_t3_", "si_t4_"];
        var panels = ["si_p0_", "si_p1_", "si_p2_", "si_p3_", "si_p4_"];

        tabs.forEach(function (tid, idx) {
            var tabEl = B._el(tid + w);
            if (!tabEl) return;
            tabEl.addEventListener("click", function () {
                tabs.forEach(function (t, i) {
                    var te = B._el(t + w);
                    var pe = B._el(panels[i] + w);
                    if (te) te.classList.toggle("active", i === idx);
                    if (pe) pe.classList.toggle("active", i === idx);
                });
            });
        });

        // ── Anzeige aktualisieren ────────────────────────────────────────────
        function update() {
            // Betriebsstatus
            var si = stateInfo(B._val(data, "oid_runState"));
            var badge = B._el("si_badge_" + w);
            if (badge) { badge.textContent = si.label; badge.className = "sig-inv-badge " + si.cls; }

            // Start/Stop-Button: 0=Stop, 1=Start (invertiert zu Charger!)
            var ssOid  = data.attr("oid_startStop");
            var ssVal  = ssOid ? parseInt(vis.states[ssOid + ".val"]) : null;
            var ssBtn  = B._el("si_ss_btn_" + w);
            if (ssBtn) {
                var isRunning = (ssVal === 1 || si.cls === "running");
                ssBtn.textContent = isRunning ? "Stop" : "Start";
                ssBtn.className   = "sig-inv-startstop " + (isRunning ? "running" : "stopped");
            }

            // Tab Leistung
            var ap  = parseFloat(B._val(data, "oid_activePower")) || 0;
            var pv  = parseFloat(B._val(data, "oid_pvPower"))     || 0;
            var ess = parseFloat(B._val(data, "oid_essPower"))    || 0;
            B._txt("si_apwr_"    + w, B._fmtKW(ap));
            B._txt("si_pv_"      + w, B._fmtKW(pv));
            B._txt("si_esspwr_"  + w, B._fmtKW(ess));
            B._txt("si_ess_dir_" + w, ess > 0.05 ? "▲ Laden" : ess < -0.05 ? "▼ Entladen" : "Bereit");
            B._css("si_esspwr_"  + w, "color", ess > 0.05 ? "#27ae60" : ess < -0.05 ? "#e74c3c" : "#9b59b6");

            // Leistungsanteil-Slider
            var pctOid = data.attr("oid_pwrPct");
            var pctVal = pctOid ? parseFloat(vis.states[pctOid + ".val"]) || 0 : 0;
            var pctSl  = B._el("si_pct_sl_" + w);
            if (pctSl && !pctSl._dragging) pctSl.value = Math.round(pctVal);
            B._txt("si_pct_lbl_" + w, pctOid ? Math.round(pctVal) + " %" : "–");

            // Tab Batterie
            var soc  = parseFloat(B._val(data, "oid_soc"))      || 0;
            var soh  = parseFloat(B._val(data, "oid_soh"))      || 0;
            var ct   = B._val(data, "oid_cellTemp");
            var cv   = parseFloat(B._val(data, "oid_cellVolt")) || 0;
            var tmax = B._val(data, "oid_maxTemp");
            var tmin = B._val(data, "oid_minTemp");
            var socCol = B._socCol(soc);
            B._txt("si_soc_"  + w, B._fmtPct(soc));  B._css("si_soc_" + w, "color", socCol);
            B._txt("si_soh_"  + w, B._fmtPct(soh));  B._css("si_soh_" + w, "color", soh > 80 ? "#27ae60" : "#f39c12");
            var bar = B._el("si_soc_bar_" + w);
            if (bar) { bar.style.width = Math.min(100, soc) + "%"; bar.style.background = socCol; }
            B._txt("si_ct_"   + w, ct   !== undefined ? parseFloat(ct).toFixed(1)   + " °C" : "-- °C");
            B._css("si_ct_"   + w, "color", ct !== undefined ? tempCol(ct) : "#e0e6ef");
            B._txt("si_cv_"   + w, cv   ? cv.toFixed(3) + " V"  : "-- V");
            B._txt("si_tmax_" + w, tmax !== undefined ? parseFloat(tmax).toFixed(1) + " °C" : "-- °C");
            B._css("si_tmax_" + w, "color", tmax !== undefined ? tempCol(tmax) : "#e0e6ef");
            B._txt("si_tmin_" + w, tmin !== undefined ? parseFloat(tmin).toFixed(1) + " °C" : "-- °C");

            // Tab Netz
            var uA   = parseFloat(B._val(data, "oid_uA"))   || 0;
            var uB   = parseFloat(B._val(data, "oid_uB"))   || 0;
            var uC   = parseFloat(B._val(data, "oid_uC"))   || 0;
            var freq = parseFloat(B._val(data, "oid_freq")) || 0;
            var pf   = parseFloat(B._val(data, "oid_pf"))   || 0;
            var pcsT = B._val(data, "oid_pcsTemp");
            B._txt("si_uA_"   + w, uA   ? uA.toFixed(1)   + " V"  : "-- V");
            B._txt("si_uB_"   + w, uB   ? uB.toFixed(1)   + " V"  : "-- V");
            B._txt("si_uC_"   + w, uC   ? uC.toFixed(1)   + " V"  : "-- V");
            B._txt("si_freq_" + w, freq ? freq.toFixed(2)  + " Hz" : "-- Hz");
            B._txt("si_pf_"   + w, pf   ? pf.toFixed(3)           : "--");
            B._txt("si_pcs_t_"+ w, pcsT !== undefined ? parseFloat(pcsT).toFixed(1) + " °C" : "-- °C");
            B._css("si_pcs_t_"+ w, "color", pcsT !== undefined ? tempCol(pcsT) : (dark ? "#e0e6ef" : "#2c3e50"));

            // Tab Alarme
            [1,2,3,4,5].forEach(function (i) {
                var ai  = almInfo(B._val(data, "oid_alm" + i));
                var row = B._el("si_alm" + i + "row_" + w);
                var val = B._el("si_alm" + i + "_"    + w);
                if (row) { row.className = "sig-inv-alm-row " + ai.cls; }
                if (val) { val.textContent = ai.text; val.className = "sig-inv-alm-val " + ai.valCls; }
            });

            // Tab Info
            B._txt("si_model_"  + w, B._val(data, "oid_model")  || "–");
            B._txt("si_serial_" + w, B._val(data, "oid_serial") || "–");
            B._txt("si_fw_"     + w, B._val(data, "oid_fw")     || "–");

            // EMS-Button
            var emsOid = data.attr("oid_emsEnable");
            var emsVal = emsOid ? parseInt(vis.states[emsOid + ".val"]) : null;
            var emsBtn = B._el("si_ems_btn_" + w);
            if (emsBtn) {
                var emsOn = (emsVal === 1);
                emsBtn.textContent = emsOn ? "Aktiv" : "Inaktiv";
                emsBtn.className   = "sig-inv-toggle " + (emsOn ? "on" : "off");
            }
        }

        // ── Steuer-Events ────────────────────────────────────────────────────
        // Start/Stop (0=Stop, 1=Start)
        var ssBtn = B._el("si_ss_btn_" + w);
        if (ssBtn) {
            ssBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (!oid) return;
                var cur = parseInt(vis.states[oid + ".val"]);
                vis.setValue(oid, cur === 1 ? 0 : 1);
            });
        }

        // EMS-Toggle
        var emsBtn = B._el("si_ems_btn_" + w);
        if (emsBtn) {
            emsBtn.addEventListener("click", function () {
                var oid = data.attr("oid_emsEnable");
                if (!oid) return;
                var cur = parseInt(vis.states[oid + ".val"]);
                vis.setValue(oid, cur === 1 ? 0 : 1);
            });
        }

        // Leistungsanteil-Slider
        var pctSl  = B._el("si_pct_sl_" + w);
        var pctLbl = B._el("si_pct_lbl_" + w);
        if (pctSl && pctLbl) {
            pctSl.addEventListener("input", function () {
                pctLbl.textContent = pctSl.value + " %";
            });
            pctSl.addEventListener("mousedown",  function () { pctSl._dragging = true;  });
            pctSl.addEventListener("touchstart", function () { pctSl._dragging = true;  });
            pctSl.addEventListener("mouseup",    function () {
                pctSl._dragging = false;
                var oid = data.attr("oid_pwrPct");
                if (oid) vis.setValue(oid, parseFloat(pctSl.value));
            });
            pctSl.addEventListener("touchend",   function () {
                pctSl._dragging = false;
                var oid = data.attr("oid_pwrPct");
                if (oid) vis.setValue(oid, parseFloat(pctSl.value));
            });
        }

        B._subscribe(widgetID, data,
            ["oid_activePower","oid_pvPower","oid_essPower","oid_runState",
             "oid_soc","oid_soh","oid_cellTemp","oid_cellVolt","oid_maxTemp","oid_minTemp",
             "oid_uA","oid_uB","oid_uC","oid_freq","oid_pf","oid_pcsTemp",
             "oid_alm1","oid_alm2","oid_alm3","oid_alm4","oid_alm5",
             "oid_fw","oid_model","oid_serial",
             "oid_startStop","oid_emsEnable","oid_pwrPct"],
            update);
        update();
    },



    // ── Widget 8: SigenMicro Übersicht ──────────────────────────────────────
    //
    // VIS-2-konforme Implementierung mit Anker-OID-Muster:
    //   oid_micro1 … oid_micro20  (Typ /id, Namensgebung beginnt mit "oid_")
    //   → VIS lädt diese States beim Start vor und subscribed automatisch
    //   → Widget extrahiert den Geräte-Präfix und baut alle 15 Register-Pfade
    //
    // Layout-Schwellen:
    //   1–5  Geräte: 1 Zeile, 80×90 px
    //   6–10 Geräte: 1 Zeile, 52×60 px
    //  11–15 Geräte: 2 Zeilen, 46×52 px
    //  16–20 Geräte: 2 Zeilen, 40×46 px
    //
    // Register-Reihenfolge (01–15, aufsteigend nach Adresse):
    //   01 modelType  02 serialNumber  03 firmwareVersion  04 runningState
    //   05 outputPower  06 gridFrequency  07 temperature
    //   08 mppt1Voltage  09 mppt1Current  10 mppt1Power
    //   11 mppt2Voltage  12 mppt2Current  13 mppt2Power
    //   14 dailyYield  15 totalYield

    _SM_REGISTERS: [
        { nr:"01", name:"modelType",      desc:"Modell-Typ",      unit:"",    col:"" },
        { nr:"02", name:"serialNumber",   desc:"Seriennummer",    unit:"",    col:"" },
        { nr:"03", name:"firmwareVersion",desc:"Firmware",        unit:"",    col:"" },
        { nr:"04", name:"runningState",   desc:"Betriebsstatus",  unit:"",    col:"state" },
        { nr:"05", name:"outputPower",    desc:"AC-Leistung",     unit:"kW",  col:"power" },
        { nr:"06", name:"gridFrequency",  desc:"Netzfrequenz",    unit:"Hz",  col:"blue" },
        { nr:"07", name:"temperature",    desc:"Temperatur",      unit:"°C",  col:"temp" },
        { nr:"08", name:"mppt1Voltage",   desc:"MPPT1 Spannung",  unit:"V",   col:"" },
        { nr:"09", name:"mppt1Current",   desc:"MPPT1 Strom",     unit:"A",   col:"" },
        { nr:"10", name:"mppt1Power",     desc:"MPPT1 Leistung",  unit:"kW",  col:"power" },
        { nr:"11", name:"mppt2Voltage",   desc:"MPPT2 Spannung",  unit:"V",   col:"" },
        { nr:"12", name:"mppt2Current",   desc:"MPPT2 Strom",     unit:"A",   col:"" },
        { nr:"13", name:"mppt2Power",     desc:"MPPT2 Leistung",  unit:"kW",  col:"power" },
        { nr:"14", name:"dailyYield",     desc:"Tagesertrag",     unit:"kWh", col:"energy" },
        { nr:"15", name:"totalYield",     desc:"Gesamtertrag",    unit:"kWh", col:"blue" }
    ],

    _SM_LAYOUTS: [
        { max:5,  rows:1, imgW:80, imgH:90 },
        { max:10, rows:1, imgW:52, imgH:60 },
        { max:15, rows:2, imgW:46, imgH:52 },
        { max:20, rows:2, imgW:40, imgH:46 }
    ],

    _smLayout: function(n) {
        var L = vis.binds["vis-2-widgets-sigenergy"]._SM_LAYOUTS;
        for (var i = 0; i < L.length; i++) { if (n <= L[i].max) return L[i]; }
        return L[L.length - 1];
    },

    _smStateInfo: function(state) {
        var s = parseInt(state);
        if (s === 1) return { label:"Running",  cls:"run",  badge:"sig-sm-badge-run",  col:"#2ecc8a" };
        if (s === 2) return { label:"Fault",    cls:"err",  badge:"sig-sm-badge-err",  col:"#e05555" };
        if (s === 3) return { label:"Shutdown", cls:"idle", badge:"sig-sm-badge-idle", col:"#5a7a90" };
        return              { label:"Standby",  cls:"idle", badge:"sig-sm-badge-idle", col:"#5a7a90" };
    },

    _smValCol: function(col, val, dark) {
        var tc = dark ? "#d8e4f0" : "#2c3e50";
        if (col === "power")  return "#2ecc8a";
        if (col === "energy") return "#e8a22a";
        if (col === "blue")   return "#4a9eed";
        if (col === "temp") {
            var t = parseFloat(val);
            return t > 70 ? "#e05555" : t > 50 ? "#e8a22a" : tc;
        }
        return tc;
    },

    _smFmtVal: function(reg, raw) {
        if (raw === undefined || raw === null) return "--";
        if (reg.unit === "" || reg.name === "runningState" ||
            reg.name === "modelType" || reg.name === "serialNumber" ||
            reg.name === "firmwareVersion") return String(raw);
        var n = parseFloat(raw);
        if (isNaN(n)) return "--";
        if (reg.unit === "kW" || reg.unit === "kWh") return n.toFixed(2);
        if (reg.unit === "V") return n.toFixed(1);
        if (reg.unit === "A") return n.toFixed(2);
        if (reg.unit === "Hz") return n.toFixed(2);
        if (reg.unit === "°C") return n.toFixed(1);
        return String(raw);
    },

    // ── SVG Device Icon (inline, kein externes Bild nötig für den SVG-Canvas) ──
    _smDevIcon: function(state, w, h) {
        var si = vis.binds["vis-2-widgets-sigenergy"]._smStateInfo(state);
        var c  = si.col;
        var bg = state === 1 ? "#1a3028" : "#1a2230";
        var rx = Math.max(3, w * 0.11);
        return "<svg viewBox=\"0 0 " + w + " " + h + "\" xmlns=\"http://www.w3.org/2000/svg\"" +
            " style=\"width:" + w + "px;height:" + h + "px;display:block\">" +
            "<rect x=\"1.5\" y=\"1.5\" width=\"" + (w-3) + "\" height=\"" + (h-3) + "\"" +
            " rx=\"" + rx + "\" fill=\"" + bg + "\" stroke=\"" + c + "\" stroke-width=\"1.5\"/>" +
            "<rect x=\"" + (w*.14) + "\" y=\"" + (h*.1) + "\" width=\"" + (w*.72) + "\" height=\"" + (h*.07) + "\"" +
            " rx=\"2\" fill=\"" + c + "\" opacity=\".28\"/>" +
            "<rect x=\"" + (w*.14) + "\" y=\"" + (h*.21) + "\" width=\"" + (w*.72) + "\" height=\"" + (h*.33) + "\"" +
            " rx=\"2.5\" fill=\"rgba(255,255,255,.04)\" stroke=\"" + c + "\" stroke-width=\".7\" opacity=\".45\"/>" +
            "<rect x=\"" + (w*.21) + "\" y=\"" + (h*.26) + "\" width=\"" + (w*.28) + "\" height=\"" + (h*.055) + "\"" +
            " rx=\"1\" fill=\"" + c + "\" opacity=\".5\"/>" +
            "<rect x=\"" + (w*.21) + "\" y=\"" + (h*.33) + "\" width=\"" + (w*.46) + "\" height=\"" + (h*.055) + "\"" +
            " rx=\"1\" fill=\"" + c + "\" opacity=\".35\"/>" +
            "<rect x=\"" + (w*.21) + "\" y=\"" + (h*.40) + "\" width=\"" + (w*.36) + "\" height=\"" + (h*.055) + "\"" +
            " rx=\"1\" fill=\"" + c + "\" opacity=\".22\"/>" +
            "<rect x=\"" + (w*.14) + "\" y=\"" + (h*.65) + "\" width=\"" + (w*.72) + "\" height=\"" + (h*.1) + "\"" +
            " rx=\"2\" fill=\"rgba(255,255,255,.04)\" stroke=\"" + c + "\" stroke-width=\".6\" opacity=\".38\"/>" +
            "<circle cx=\"" + (w*.3) + "\" cy=\"" + (h*.7) + "\" r=\"" + Math.max(1.5, w*.036) + "\"" +
            " fill=\"" + (state===1 ? c : "rgba(255,255,255,.1)") + "\"/>" +
            "<circle cx=\"" + (w*.5) + "\" cy=\"" + (h*.7) + "\" r=\"" + Math.max(1.5, w*.036) + "\"" +
            " fill=\"" + (state===1 ? c : "rgba(255,255,255,.1)") + "\"/>" +
            "<circle cx=\"" + (w*.7) + "\" cy=\"" + (h*.7) + "\" r=\"" + Math.max(1.5, w*.036) + "\"" +
            " fill=\"" + (state===1 ? c : "rgba(255,255,255,.1)") + "\"/>" +
            "<rect x=\"" + (w*.34) + "\" y=\"" + (h*.82) + "\" width=\"" + (w*.32) + "\" height=\"" + (h*.065) + "\"" +
            " rx=\"1.5\" fill=\"" + c + "\" opacity=\".42\"/>" +
            "</svg>";
    },

    // ── Bus-Zeile als SVG ──────────────────────────────────────────────────
    _smBusRow: function(devSlice, startNr, VW, imgW, imgH, rowIdx) {
        var B = vis.binds["vis-2-widgets-sigenergy"];
        var n    = devSlice.length;
        if (n === 0) return "";
        var spc  = VW / n;
        var cx   = [];
        for (var i = 0; i < n; i++) { cx.push(Math.round(spc * i + spc / 2)); }
        var imgTop = 6;
        var imgBot = imgTop + imgH;
        var stubH  = Math.max(14, Math.round(imgH * 0.28));
        var busY   = imgBot + stubH;
        var svgH   = busY + 12;
        var anyActive = devSlice.some(function(d) { return d.state === 1; });
        var delay = rowIdx * 0.35;

        var s = "<svg viewBox=\"0 0 " + VW + " " + svgH + "\" xmlns=\"http://www.w3.org/2000/svg\"" +
                " class=\"sig-sm-net-svg\">";

        // Backbone Basis
        s += "<line x1=\"18\" y1=\"" + busY + "\" x2=\"" + (VW-18) + "\" y2=\"" + busY + "\"" +
             " class=\"sig-sm-bus-base\"/>";

        if (anyActive) {
            s += "<line x1=\"18\" y1=\"" + busY + "\" x2=\"" + (VW-18) + "\" y2=\"" + busY + "\"" +
                 " class=\"sig-sm-bus-glow\"/>";
            s += "<line x1=\"18\" y1=\"" + busY + "\" x2=\"" + (VW-18) + "\" y2=\"" + busY + "\"" +
                 " class=\"sig-sm-bus-anim\" style=\"animation-delay:" + delay + "s\"/>";
        }

        for (var i = 0; i < n; i++) {
            var d    = devSlice[i];
            var x    = cx[i];
            var si   = B._smStateInfo(d.state);
            var active = (d.state === 1);
            var iDelay = ((i + rowIdx * n) * 0.18) + "s";

            // Stichleitung Basis
            s += "<line x1=\"" + x + "\" y1=\"" + busY + "\" x2=\"" + x + "\" y2=\"" + imgBot + "\"" +
                 " class=\"sig-sm-stub-base\" stroke=\"" + (active ? "#1e3f28" : "#1e2d3a") + "\"/>";

            if (active) {
                s += "<line x1=\"" + x + "\" y1=\"" + busY + "\" x2=\"" + x + "\" y2=\"" + imgBot + "\"" +
                     " class=\"sig-sm-stub-glow\"/>";
                s += "<line x1=\"" + x + "\" y1=\"" + busY + "\" x2=\"" + x + "\" y2=\"" + imgBot + "\"" +
                     " class=\"sig-sm-stub-anim\" style=\"animation-delay:" + iDelay + "\"/>";
            }

            // T-Kreuzungspunkt
            var tR = Math.max(3.5, imgW * 0.06);
            s += "<circle cx=\"" + x + "\" cy=\"" + busY + "\" r=\"" + tR + "\"" +
                 " fill=\"" + (active ? "#2ecc8a" : "#1e2d3a") + "\"" +
                 " stroke=\"" + si.col + "\" stroke-width=\"1.5\" opacity=\"" + (active ? 1 : 0.5) + "\"/>";

            // Gerätebild via foreignObject
            var glow = active ? "drop-shadow(0 0 6px rgba(46,204,138,.4))" : "none";
            var brd  = "2px solid " + si.col;
            s += "<foreignObject x=\"" + (x - imgW/2) + "\" y=\"" + imgTop + "\"" +
                 " width=\"" + imgW + "\" height=\"" + imgH + "\">" +
                 "<div xmlns=\"http://www.w3.org/1999/xhtml\"" +
                 " style=\"width:" + imgW + "px;height:" + imgH + "px;" +
                 "border-radius:" + Math.max(4, imgW*.1) + "px;" +
                 "overflow:hidden;border:" + brd + ";" +
                 "filter:" + glow + "\">" +
                 "<img src=\"widgets/vis-2-widgets-sigenergy/img/SigenMicroInverter.png\""" +
                 " style=\"width:100%;height:100%;object-fit:contain;display:block\"/>" +
                 "</div></foreignObject>";

            // Gerätenummer-Label
            var nr  = String(startNr + i).padStart(2, "0");
            var fs  = Math.max(7, imgW * 0.1);
            s += "<text x=\"" + x + "\" y=\"" + (busY + 11) + "\" text-anchor=\"middle\"" +
                 " font-family=\"monospace\" font-size=\"" + fs + "\"" +
                 " fill=\"" + si.col + "\" opacity=\"" + (active ? 1 : 0.5) + "\">" + nr + "</text>";
        }

        s += "</svg>";
        return s;
    },

    // ── Übersicht-Tab (Tab 1) ─────────────────────────────────────────────
    _smBuildOverview: function(w, devices, dark) {
        var B   = vis.binds["vis-2-widgets-sigenergy"];
        var VW  = 620;
        var lay = B._smLayout(devices.length);
        var perRow = Math.ceil(devices.length / lay.rows);
        var svgHTML = "";

        for (var r = 0; r < lay.rows; r++) {
            var slice = devices.slice(r * perRow, (r + 1) * perRow);
            if (slice.length === 0) continue;
            // Geräte mit aktuellem State anreichern
            var sliceWithState = slice.map(function(d) {
                var stateVal = vis.states[d.prefix + ".runningState.val"];
                return { state: (stateVal !== undefined ? parseInt(stateVal) : 0) };
            });
            svgHTML += B._smBusRow(sliceWithState, r * perRow + 1, VW, lay.imgW, lay.imgH, r);
        }

        // Labels-Reihe
        var labelsHTML = "<div class=\"sig-sm-labels\">";
        for (var i = 0; i < Math.min(devices.length, lay.rows === 1 ? 20 : perRow); i++) {
            var d    = devices[i];
            var stV  = vis.states[d.prefix + ".runningState.val"];
            var si   = B._smStateInfo(stV);
            var pwrV = parseFloat(vis.states[d.prefix + ".outputPower.val"]);
            var nr   = String(i + 1).padStart(2, "0");
            labelsHTML +=
                "<div class=\"sig-sm-label\">" +
                "<div class=\"sig-sm-label-id\" style=\"color:" + si.col + "\">Gerät " + nr + "</div>" +
                (si.cls === "run" && !isNaN(pwrV) ?
                    "<div class=\"sig-sm-label-pwr\">" + pwrV.toFixed(2) + " kW</div>" : "") +
                "<div class=\"sig-sm-label-st\" style=\"color:" + si.col + "\">" +
                (si.cls === "run" ? "● " : si.cls === "err" ? "▲ " : "○ ") + si.label +
                "</div></div>";
        }
        if (lay.rows > 1 && devices.length > perRow) {
            labelsHTML += "</div><div class=\"sig-sm-labels\">";
            for (var i = perRow; i < devices.length; i++) {
                var d    = devices[i];
                var stV  = vis.states[d.prefix + ".runningState.val"];
                var si   = B._smStateInfo(stV);
                var pwrV = parseFloat(vis.states[d.prefix + ".outputPower.val"]);
                var nr   = String(i + 1).padStart(2, "0");
                labelsHTML +=
                    "<div class=\"sig-sm-label\">" +
                    "<div class=\"sig-sm-label-id\" style=\"color:" + si.col + "\">Gerät " + nr + "</div>" +
                    (si.cls === "run" && !isNaN(pwrV) ?
                        "<div class=\"sig-sm-label-pwr\">" + pwrV.toFixed(2) + " kW</div>" : "") +
                    "<div class=\"sig-sm-label-st\" style=\"color:" + si.col + "\">" +
                    (si.cls === "run" ? "● " : si.cls === "err" ? "▲ " : "○ ") + si.label +
                    "</div></div>";
            }
        }
        labelsHTML += "</div>";

        // Aggregat-Kacheln
        var totalP = 0, totalDay = 0, totalLife = 0, running = 0;
        devices.forEach(function(d) {
            var pwr  = parseFloat(vis.states[d.prefix + ".outputPower.val"])  || 0;
            var day  = parseFloat(vis.states[d.prefix + ".dailyYield.val"])   || 0;
            var life = parseFloat(vis.states[d.prefix + ".totalYield.val"])   || 0;
            var st   = parseInt(vis.states[d.prefix + ".runningState.val"]);
            totalP    += pwr;
            totalDay  += day;
            totalLife += life;
            if (st === 1) running++;
        });
        var runCol = running === devices.length ? "#2ecc8a" : running > 0 ? "#e8a22a" : "#e05555";

        var kacheln =
            "<div class=\"sig-sm-kacheln\">" +
            "<div class=\"sig-sm-kach\">" +
                "<div class=\"sig-sm-kach-lbl\">AC-Leistung</div>" +
                "<div class=\"sig-sm-kach-val\" style=\"color:#2ecc8a\">" + totalP.toFixed(2) +
                "<span class=\"sig-sm-kach-unit\">kW</span></div>" +
                "<div class=\"sig-sm-kach-sub\">Gesamt aktiv</div></div>" +
            "<div class=\"sig-sm-kach\">" +
                "<div class=\"sig-sm-kach-lbl\">Heute</div>" +
                "<div class=\"sig-sm-kach-val\" style=\"color:#e8a22a\">" + totalDay.toFixed(2) +
                "<span class=\"sig-sm-kach-unit\">kWh</span></div>" +
                "<div class=\"sig-sm-kach-sub\">Tagesertrag</div></div>" +
            "<div class=\"sig-sm-kach\">" +
                "<div class=\"sig-sm-kach-lbl\">Gesamt</div>" +
                "<div class=\"sig-sm-kach-val\" style=\"color:#4a9eed\">" + totalLife.toFixed(1) +
                "<span class=\"sig-sm-kach-unit\">kWh</span></div>" +
                "<div class=\"sig-sm-kach-sub\">Lebensertrag</div></div>" +
            "<div class=\"sig-sm-kach\">" +
                "<div class=\"sig-sm-kach-lbl\">Online</div>" +
                "<div class=\"sig-sm-kach-val\" style=\"color:" + runCol + "\">" + running +
                "<span class=\"sig-sm-kach-unit\">/" + devices.length + "</span></div>" +
                "<div class=\"sig-sm-kach-sub\">Running</div></div>" +
            "</div>";

        return svgHTML + labelsHTML + kacheln;
    },

    // ── Detail-Tab (Tabs 2+) ──────────────────────────────────────────────
    _smBuildDetail: function(d, nr, dark) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var REGS = B._SM_REGISTERS;
        var stV  = vis.states[d.prefix + ".runningState.val"];
        var si   = B._smStateInfo(stV);
        var tc   = dark ? "#d8e4f0" : "#2c3e50";

        var modelVal  = vis.states[d.prefix + ".modelType.val"]       || "–";
        var serialVal = vis.states[d.prefix + ".serialNumber.val"]    || "–";
        var fwVal     = vis.states[d.prefix + ".firmwareVersion.val"] || "–";

        var header =
            "<div class=\"sig-sm-det-hdr\">" +
            "<div class=\"sig-sm-det-img " + si.cls + "\">" +
            "<img src=\"widgets/vis-2-widgets-sigenergy/img/SigenMicroInverter.png\""" +
            " style=\"width:100%;height:100%;object-fit:contain\"/></div>" +
            "<div class=\"sig-sm-det-info\">" +
            "<div class=\"sig-sm-det-model\" style=\"color:" + tc + "\">Gerät " +
            String(nr).padStart(2,"0") + " — " + modelVal + "</div>" +
            "<div class=\"sig-sm-det-serial\">SN: " + serialVal + "</div>" +
            "<div class=\"sig-sm-det-fw\">FW: " + fwVal + " · Slave-ID: " + d.slaveId + "</div>" +
            "<div class=\"det-badge " + si.badge + "\">" +
            "<span class=\"sig-sm-badge-dot\"></span>" + si.label + "</div>" +
            "</div></div>";

        var regCards = "";
        for (var i = 0; i < REGS.length; i++) {
            var reg = REGS[i];
            var raw = vis.states[d.prefix + "." + reg.name + ".val"];
            var fmtVal = B._smFmtVal(reg, raw);
            var col    = reg.col === "state" ? si.col : B._smValCol(reg.col, raw, dark);
            var isStr  = (reg.unit === "" && reg.col === "");
            regCards +=
                "<div class=\"sig-sm-reg-card\">" +
                "<div class=\"sig-sm-reg-nr\">" + reg.nr + "</div>" +
                "<div class=\"sig-sm-reg-lbl\">" + reg.desc + "</div>" +
                "<div class=\"sig-sm-reg-val\" style=\"color:" + (isStr ? tc : col) + ";font-size:" +
                    (isStr ? "0.72rem" : "1rem") + "\">" +
                    fmtVal +
                    (reg.unit ? "<span class=\"sig-sm-reg-unit\">" + reg.unit + "</span>" : "") +
                "</div>" +
                "<div class=\"sig-sm-reg-oid\">" + d.prefix + "." + reg.name + "</div>" +
                "</div>";
        }

        return header + "<div class=\"sig-sm-reg-grid\">" + regCards + "</div>";
    },

    // ── Haupt-Render (Update) ─────────────────────────────────────────────
    _smRender: function(w, devices, dark, activeTab) {
        var B = vis.binds["vis-2-widgets-sigenergy"];

        // Tab 1: Übersicht
        var ov = B._el("sm_ov_" + w);
        if (ov) ov.innerHTML = B._smBuildOverview(w, devices, dark);

        // Tabs 2+: Detail
        devices.forEach(function(d, i) {
            var det = B._el("sm_det_" + w + "_" + (i+1));
            if (det) det.innerHTML = B._smBuildDetail(d, i+1, dark);
        });
    },

    // ── Initialisierung ───────────────────────────────────────────────────
    createSigenMicroOverview: function(widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function() {
                B.createSigenMicroOverview(widgetID, view, data, style);
            }, 100);
        }

        var count = Math.min(Math.max(1, parseInt(data.attr("micro_count")) || 3), 20);
        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "SigenMicro";
        var w     = widgetID;
        var cls   = dark ? "sig-sm-wrap" : "sig-sm-wrap light";

        // Geräte-Daten aus Anker-OIDs extrahieren
        var devices = [];
        for (var i = 1; i <= count; i++) {
            var anchorOid = data.attr("oid_micro" + i);
            if (!anchorOid) continue;
            // "sigenergy.0.sigenmicro.11.outputPower" → prefix = "sigenergy.0.sigenmicro.11"
            var parts = anchorOid.split(".");
            parts.pop();
            var prefix  = parts.join(".");
            var slaveId = parts[parts.length - 1];
            devices.push({ anchorOid: anchorOid, prefix: prefix, slaveId: slaveId });
        }

        // ── Tab-Bar aufbauen ──
        var tabBarHTML = "<div class=\"sig-sm-tabbar\" id=\"sm_tabs_" + w + "\">";
        tabBarHTML += "<div class=\"sig-sm-tab active\" data-tab=\"0\">Übersicht</div>";
        for (var i = 0; i < devices.length; i++) {
            tabBarHTML += "<div class=\"sig-sm-tab\" data-tab=\"" + (i+1) + "\">Gerät " +
                String(i+1).padStart(2,"0") + "</div>";
        }
        tabBarHTML += "</div>";

        // ── Panel-Container aufbauen ──
        var panelsHTML = "<div id=\"sm_ov_" + w + "\" class=\"sig-sm-panel active\"></div>";
        for (var i = 0; i < devices.length; i++) {
            panelsHTML += "<div id=\"sm_det_" + w + "_" + (i+1) + "\" class=\"sig-sm-panel\"></div>";
        }

        // ── Widget HTML zusammensetzen ──
        $div.html(
            "<div class=\"sig-w\"><div class=\"" + cls + "\">" +
            "<div class=\"sig-sm-title\">&#9889; " + title + "</div>" +
            tabBarHTML +
            panelsHTML +
            "</div></div>"
        );

        // ── Tab-Klick-Handler ──
        var $tabBar = $("#sm_tabs_" + w);
        $tabBar.on("click", ".sig-sm-tab", function() {
            var idx = parseInt($(this).data("tab"));
            $tabBar.find(".sig-sm-tab").removeClass("active");
            $(this).addClass("active");
            var $panels = $div.find(".sig-sm-panel");
            $panels.removeClass("active");
            $panels.eq(idx).addClass("active");
        });

        // ── State-Subscription ──────────────────────────────────────────
        // Die Anker-OIDs (oid_micro1..N) sind /id-Felder → VIS lädt sie vor.
        // Alle weiteren Register-OIDs werden manuell subscribed.
        var REGS = B._SM_REGISTERS;
        var bound = [];

        function doUpdate() { B._smRender(w, devices, dark, 0); }

        devices.forEach(function(d) {
            REGS.forEach(function(reg) {
                var key = d.prefix + "." + reg.name + ".val";
                bound.push(key);
                vis.states.bind(key, doUpdate);
            });
        });

        $div.data("bound", bound);
        $div.data("bindHandler", doUpdate);

        // Initiales Rendering
        doUpdate();
    }

,

    // ── Widget 9: PV Power ─────────────────────────────────────────────────
    createPvStrings: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createPvStrings(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "PV Power";
        var w     = widgetID;

        var bg     = dark ? "linear-gradient(160deg,#0d1219,#111a26)" : "#f0f4f8";
        var txtCol = dark ? "#d0e4f4" : "#1a2a3a";
        var subCol = dark ? "#5a7898" : "#6a8aaa";
        var pvCol  = "#f39c12";
        var markId = "mPvStr_" + w;

        // Bildpfade - identisch zum bewährten SigenMicro-Ansatz
        var imgPanel = "widgets/vis-2-widgets-sigenergy/img/solarpanel.png";
        var imgInv   = "widgets/vis-2-widgets-sigenergy/img/Sigen_Hybrid_Vorderansicht.png";

        var svgArrows =
            '<svg id="sig_pvs_svg_' + w + '" ' +
            'viewBox="0 0 388 70" preserveAspectRatio="none" ' +
            'style="position:absolute;top:0;left:0;width:100%;height:70px;pointer-events:none;overflow:visible;">' +
            '<defs>' +
            '<marker id="' + markId + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">' +
            '<polygon points="0,0 6,3 0,6" fill="' + pvCol + '"/>' +
            '</marker>' +
            '</defs>' +
            '<path id="sig_pvs_path_pv1_' + w + '" class="sig-flow-path" stroke="' + pvCol + '" ' +
            'd="M55,0 Q55,45 194,65" marker-end="url(#' + markId + ')"/>' +
            '<path id="sig_pvs_path_pv2_' + w + '" class="sig-flow-path" stroke="' + pvCol + '" ' +
            'd="M194,0 L194,65" marker-end="url(#' + markId + ')"/>' +
            '<path id="sig_pvs_path_pv3_' + w + '" class="sig-flow-path" stroke="' + pvCol + '" ' +
            'd="M333,0 Q333,45 194,65" marker-end="url(#' + markId + ')"/>' +
            '</svg>';

        // ── Widget-HTML mit eingebetteten Bildern (SVG <image> mit base64) ──
        // Identisch zum EnergyFlow-Prinzip: $div.html() mit allem inline.
        // Kein externer Dateipfad, kein Upload nötig — funktioniert immer.
        var sw = 130, sh = 65, hw = 220, hh = 96;
        var imgSolar  = B._PVS_SOLAR;
        var imgHybrid = B._PVS_HYBRID;

        $div.html(
            '<div class="sig-w"><div style="' +
            'background:' + bg + ';border-radius:14px;padding:16px 14px 14px;' +
            'box-sizing:border-box;font-family:sans-serif;color:' + txtCol + ';width:100%;">' +
            '<div style="text-align:center;font-size:11px;letter-spacing:1.2px;' +
            'text-transform:uppercase;color:' + pvCol + ';margin-bottom:12px;opacity:.85;">' +
            '&#9728; ' + title + '</div>' +
            '<div style="display:flex;justify-content:space-around;align-items:flex-end;">' +

            '<div style="position:relative;width:' + sw + 'px;text-align:center;">' +
            '<svg width="' + sw + '" height="' + sh + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;filter:drop-shadow(0 2px 6px rgba(243,156,18,.2));">' +
            '<image x="0" y="0" width="' + sw + '" height="' + sh + '" href="' + imgSolar + '"/></svg>' +
            '<div id="sig_pvs_val1_' + w + '" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.6);border-radius:5px;padding:2px 7px;font-size:13px;font-weight:500;color:' + pvCol + ';white-space:nowrap;">-- W</div>' +
            '<div style="font-size:10px;color:' + subCol + ';margin-top:4px;">String 1</div>' +
            '</div>' +

            '<div style="position:relative;width:' + sw + 'px;text-align:center;">' +
            '<svg width="' + sw + '" height="' + sh + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;filter:drop-shadow(0 2px 6px rgba(243,156,18,.2));">' +
            '<image x="0" y="0" width="' + sw + '" height="' + sh + '" href="' + imgSolar + '"/></svg>' +
            '<div id="sig_pvs_val2_' + w + '" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.6);border-radius:5px;padding:2px 7px;font-size:13px;font-weight:500;color:' + pvCol + ';white-space:nowrap;">-- W</div>' +
            '<div style="font-size:10px;color:' + subCol + ';margin-top:4px;">String 2</div>' +
            '</div>' +

            '<div style="position:relative;width:' + sw + 'px;text-align:center;">' +
            '<svg width="' + sw + '" height="' + sh + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;filter:drop-shadow(0 2px 6px rgba(243,156,18,.2));">' +
            '<image x="0" y="0" width="' + sw + '" height="' + sh + '" href="' + imgSolar + '"/></svg>' +
            '<div id="sig_pvs_val3_' + w + '" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.6);border-radius:5px;padding:2px 7px;font-size:13px;font-weight:500;color:' + pvCol + ';white-space:nowrap;">-- W</div>' +
            '<div style="font-size:10px;color:' + subCol + ';margin-top:4px;">String 3</div>' +
            '</div>' +
            '</div>' +

            '<div style="position:relative;height:70px;width:100%;">' + svgArrows + '</div>' +

            '<div style="text-align:center;">' +
            '<svg width="' + hw + '" height="' + hh + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:inline-block;filter:drop-shadow(0 3px 10px rgba(52,152,219,.18));">' +
            '<image x="0" y="0" width="' + hw + '" height="' + hh + '" href="' + imgHybrid + '"/></svg>' +
            '</div>' +

            '<div style="text-align:center;margin-top:8px;">' +
            '<div style="display:inline-block;background:rgba(243,156,18,.1);border:1px solid rgba(243,156,18,.35);border-radius:8px;padding:4px 18px;">' +
            '<div style="font-size:10px;color:' + subCol + ';letter-spacing:.5px;">Gesamt PV</div>' +
            '<div id="sig_pvs_total_' + w + '" style="font-size:18px;font-weight:600;color:' + pvCol + ';line-height:1.25;">-- W</div>' +
            '</div></div>' +
            '</div></div>'
        );

        function update() {
            var pv1   = parseFloat(B._val(data, "oid_pv1"))     || 0;
            var pv2   = parseFloat(B._val(data, "oid_pv2"))     || 0;
            var pv3   = parseFloat(B._val(data, "oid_pv3"))     || 0;
            var total = parseFloat(B._val(data, "oid_pvtotal")) || 0;

            B._txt("sig_pvs_val1_"  + w, B._fmtKW(pv1));
            B._txt("sig_pvs_val2_"  + w, B._fmtKW(pv2));
            B._txt("sig_pvs_val3_"  + w, B._fmtKW(pv3));
            B._txt("sig_pvs_total_" + w, B._fmtKW(total));

            ["pv1", "pv2", "pv3"].forEach(function(k, i) {
                var el = B._el("sig_pvs_path_" + k + "_" + w);
                if (el) {
                    if ([pv1, pv2, pv3][i] > 0.05) { el.classList.add("active"); }
                    else                             { el.classList.remove("active"); }
                }
            });
        }

        B._subscribe(widgetID, data, ["oid_pv1", "oid_pv2", "oid_pv3", "oid_pvtotal"], update);
        update();
    }

};
vis.binds["vis-2-widgets-sigenergy"].showVersion();
