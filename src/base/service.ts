import request from "./request"
import { Base64 } from 'js-base64';

export interface LoginParams {
    username: string,
    password: string
}

export interface RegisterParams {
    accountName: string,
    realName: string
    password: string
    repassword: string
    mobile: string
}

interface User {
    id: string,
    name: string
}

export interface LoginUser {
    token: string,
    user: User
}

export interface PageLoadProps {
    keyword: string;
    pageIndex: number,
    pageSize: number,
    swhere?: object
}

export interface UpdatePropss {
    keyword: string;
    list: object[]
}

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 */
export const login = async (params: LoginParams): Promise<LoginUser> => {
    window.$loadingBar?.start()
    const { token, user } = await request.post('/v1/user/login', params, {
        withCredentials: true
    })

    window.$loadingBar?.finish()
    window.$message.success('登录成功');
    return { token, user };
}

/**
 * 注册
 * @param accountName 用户名
 * @param realName 真实姓名
 * @param password 密码
 * @param repassword 确认密码
 * @param mobile 手机
 */
export const register = async (params: RegisterParams) => {
    await request.post('/v1/user/register', params)
}

/**
 * 查询用户信息
 */
export const profile = async () => {
    return request.get('/v1/user/profile')
}

/**
 * 查询用户信息
 */
export const getMenu = async (isTree = false) => {
    return request.get(`/v1/sys/sysMenu${isTree ? '/tree' : ''}`)
}

/**
 * 分页查询
 */
export const PageLoad = async (props: PageLoadProps) => {
    const { keyword, pageIndex, pageSize, swhere } = props;

    const params: any = {
        pageIndex,
        pageSize
    }

    if (swhere) {
        params.swhere = Base64.encode(JSON.stringify(swhere))
    }

    window.$loadingBar.start();
    const res = await request.get(`/v1${keyword}`, {
        params
    })
    window.$loadingBar.finish();

    return res
}

/**
 * 批量更新
 */
export const UpdateList = async (props: UpdatePropss) => {
    const { keyword, list } = props;

    window.$loadingBar.start();
    const res = await request.put(`/v1${keyword}`, list)
    window.$loadingBar.finish();
    return res
}

