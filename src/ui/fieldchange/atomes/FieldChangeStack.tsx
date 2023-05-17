import { $userValue, setUserSetting } from "../../functions/Hooks";
import { useEffect, useState } from "react";
import { inStack } from "../logics/inStack";
import { IFieldChange } from "../organoids/FieldChange";
import Arrow from '../../../assets/fieldchange/Arrow.svg'
import Setting from '../../../assets/userchange/Setting.svg'
import { inApiSaveStack } from "../logics/inApiSave";
import { useStore } from "effector-react";
import Delete from '../../../assets/userchange/Delete.svg'
import { inApiDeleteStack } from "../logics/inApiDelete";

export const createArray = (start: number, end: number) => {
    let arr = [];
    for (let i = start; i <= end; i++) {
        arr.push(i);
    }
    return arr;
}

export const FieldChangeStack = (params: IFieldChange) => {
    const userValue = useStore($userValue);
    const [valueApi, setValueApi] = useState<any>({ contacts: [], stack: [] })
    const [valueApiChoise, setValueApiChoise] = useState<any>({ contacts: "", stack: "" })
    const handleApiChoiseChange = (event: any, type: any) => {
        setValueApiChoise((prevState: any) => ({
            ...prevState,
            [type]: event.target.value ? event.target.value : event
        }))

    };
    const handleValueApi = async () => {
        try {
            const result = await inStack()
            if (result && params.keyName) {
                setValueApi({ valueApi, [params.keyName]: result })
            }
        } catch (error) {
            console.log("handleValueApi", handleValueApi)
        }
    }
    useEffect(() => {
        if ( valueApi.stack && valueApi.stack.length == 0) {
            handleValueApi()
            if(params.value){
                setValueApiChoise((prevState: any) => ({
                    ...prevState,
                    stack: params.value.name
                }))
                params.setNewValue &&    params.setNewValue(params.value.link)
                
            }
        }
    }, [params.keyName])

    useEffect(() => {
        let result = ""
        for (let i = 0; i < userValue.stack.length; i++) {
            const object = userValue.stack[i];
            if (object && object.name && object.name === valueApiChoise.stack) {
                result = object.level
            }
        }
        if (params.setNewValue) {
            params.setNewValue(result)
        }
        params.setCheck && params.setCheck(result ? true : false)

    }, [valueApiChoise])

    const handleApiDelete = async () => {
        try {
            const result = await inApiDeleteStack({ name: valueApiChoise.stack });
            if (result) {
                setUserSetting(false);
                setValueApiChoise({ contacts: "", stack: "" })
            }
        } catch (error) {
            console.log("error", error)
        }

    }
    const handleApiSave = async () => {
        try {
            const result = await inApiSaveStack({ name: valueApiChoise.stack, level: params.newValue });
            if (result) {
                setUserSetting(false);
            }
        } catch (error) {
            console.log("error", error)
        }


    };

    return (
        <div className="FieldChange__General" >
            <form onSubmit={e => { e.preventDefault(); handleApiSave(); }} className="FieldChange" >
                <img src={Arrow} className="FieldChange__Arrow" alt="Arrow" onClick={() => setUserSetting(false)} />
                {params.check && <img src={Delete} alt="Delete" className="FieldChange__Delete" onClick={handleApiDelete} />}
                <div className="FieldChange__Header" >
                    <img className="FieldChange__Image" alt="" src={Setting} />
                    <div className="FieldChange__BR">
                        Здесь вы можете изменить информацию о себе
                    </div>
                </div>
                <div className="FieldChange__Info">
                    <div className="FieldChange__Title" >
                        {params.check ? "Изменить " : "Добавить "}{params.title}
                    </div>
                    <div className="FieldChange__Inputs">
                        {valueApi.stack &&
                            <select value={valueApiChoise.stack || "Выберите навык"} onChange={(event: any) => { handleApiChoiseChange(event, "stack") }}>
                                <option style={{ display: "none" }} value={"Выберите навык"}>{"Выберите навык"}</option>
                                {valueApi.stack.map((e: any) =>
                                    <option value={e.name}>{e.name}</option>
                                )}
                            </select>
                        }
                        {valueApiChoise.stack &&
                            <>
                                <div className="FieldChange__Title">Выберите выш уровень</div>
                                <div className="FieldChange__Inputs__Stack__Bar">
                                    {[1, 2, 3, 4, 5, 6].map((e: any) =>
                                        <div className={params.newValue == e ? "FieldChange__Inputs__Stack__Bar__Level__Choise FieldChange__Inputs__Stack__Bar__Level" : "FieldChange__Inputs__Stack__Bar__Level"} onClick={() => { params.setNewValue && params.setNewValue(e) }}>
                                            {e}
                                        </div>
                                    )}
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className="FieldChange__Button__Group">
                    <div className="FieldChange__Button__Group__Cancel" onClick={() => setUserSetting(false)}>
                        Отменить
                    </div>
                    <input type="submit" className={params.newValue ? "FieldChange__Button__Group__Save" : "FieldChange__Button__Group__Cancel"} value="Сохранить" />
                </div>
            </form>
        </div>
    );
};
