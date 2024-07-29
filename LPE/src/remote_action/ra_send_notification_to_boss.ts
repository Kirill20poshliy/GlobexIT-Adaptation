declare let RESULT: {}
declare let BOSS_TYPE: number
declare let command: string
declare let form_fields: string


interface Field {
    name: string,
    value: string
}


function getMessage(): string {
    let flds: Field[] = ParseJson(form_fields)
    return ArrayOptFirstElem<Field>(flds).GetOptProperty('value')
}


function sendMessage(text: string): boolean {
    try {
        let userBosses = curUser.Child('func_managers')
        if (userBosses !== undefined && IsArray(userBosses)) {
            let boss = ArrayOptFind<unknown>(userBosses, 'This.boss_type_id==' + BOSS_TYPE) 
            let bossId: string = boss.GetOptProperty('person_id')
            return tools.create_notification(OptInt("7390428390364825813"), OptInt(bossId), text, OptInt(curUserID))
        } else {
            return false
        }
    } catch (e) {
        alert(e.message)
    }
}


switch (command) {
    case 'eval':
        RESULT = {
            command: "display_form",
            title: "Сообщение",
            message: "Введите сообщение в поле снизу",
            width: "800",
            height: "360",
            form_fields: [
                {
                    name: "fld1", 
                    label: "Сообщение", 
                    type: "text", 
                    mandatory: true, 
                    validation: "nonempty"
                }
            ],
        }
        break;

    case 'submit_form':
        let msg = getMessage()
        let res = sendMessage(msg)
        RESULT = {
            command: "alert",
            msg: res ? "Уведомление успешно отправлено!" : "При отправке уведомления возникла ошибка. Попробуйте позже!"
        }
        break;
}

export {}