export class storage {
    static store(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    static get(key: string): any {
        const elements: string | null = localStorage.getItem(key);
        if (elements === null){
            return null;
        }
        return JSON.parse(elements);
    }
}


export function getInitials(){
    if (storage.get('initials') === null){
        return 'Фамилия Имя'
    } else {
        return storage.get('initials')
    }
}

export function getEmail(){
    if (storage.get('email') === null){
        return 'Укажите вашу почту'
    } else {
        return storage.get('email')
    }
}

export function getPhone(){
    if (storage.get('phone') === null){
        return 'Укажите номер телефона'
    } else {
        return storage.get('phone')
    }
}