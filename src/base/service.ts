import request from "./request"

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

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 */
export const login = async (params: LoginParams): Promise<LoginUser> => {
    const { token, user } = await request.post('/v1/user/login', params, {
        withCredentials: true
    })

    window.$message.success('登录成功')
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

