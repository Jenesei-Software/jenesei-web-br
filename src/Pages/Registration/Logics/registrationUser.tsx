import { setaccessToken } from "../../../Common/accessToken";
import { axiosInstance } from "../../../Common/axiosInstance";
export interface IRegistrationUser {
    email: string
    password: string
    firstName: string
    lastName: string
}
export const registrationUser = async (params: IRegistrationUser) => {
    return axiosInstance.post(
        'auth/registration', {
        "email": params.email,
        "password": params.password,
        "firstName": params.firstName,
        "lastName": params.lastName,
        "birthDate": "2023-01-31T16:45:18.818Z"
    })
        .then((res: any) => { setaccessToken(res.data.token) })
        .catch(() => {
            setaccessToken("")
        })
}
