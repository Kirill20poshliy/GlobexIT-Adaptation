declare var RESULT: {}
declare var BOSS_TYPE: number
declare var command: string
declare var form_fields: string


interface Field {
    name: string,
    value: string
}


function getMessage(): string {
    var flds: Field[] = ParseJson(form_fields)
    return ArrayFirstElem(flds).GetOptProperty('value')
}


function sendMessage(text: string): boolean {
    try {
        var userBosses = curUser.Child('func_managers')
        if (userBosses !== undefined && IsArray(userBosses)) {
            var boss = ArrayOptFind<unknown>(userBosses, 'This.boss_type_id==' + BOSS_TYPE) 
            var bossId: string = boss.GetOptProperty('person_id')
            return tools.create_notification(Int("7390428390364825813"), Int(bossId), text, Int(curUserID))
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
        var msg = getMessage()
        var res = sendMessage(msg)
        RESULT = {
            command: "alert",
            msg: res ? "Уведомление успешно отправлено!" : "При отправке уведомления возникла ошибка. Попробуйте позже!"
        }
        break;
}

export {}