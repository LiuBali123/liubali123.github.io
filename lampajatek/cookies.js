export function setCookie(name,value){
    document.cookie = name + "=" + value + ";" + "path/="
}

export function getCookie(cname){
    let name = cname + "="
    //speciális karakterek miatt az alsó sor
    let decodedCookie = decodeURIComponent(document.cookie)
    //daraboljuk a cookiet
    let ca = decodedCookie.split(';')
    for(let i = 0; i < ca.length; i++){
        let c = ca[i]
        //space-ek levágása
        while(c.charAt(0) == ' '){
            c = c.substring(1)
        }
        //ha azzal kezdődik, amit keresünk
        if(c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

export function deleteCookie(cname){
    document.cookie = cname + "=" + "" + ";" + "path=/" + "; expires = 0"
}