import Request, { InterceptorHooks, ExpandAxiosResponse } from '../request'

// 请求拦截器
const transform: InterceptorHooks = {
    requestInterceptor(config) {
        // 请求头部处理
        config!.headers!['Content-Type'] = "application/json"

        return config
    },
    requestInterceptorCatch(err) {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err)
    },
    responseInterceptor(result) {
        // 因为 axios 返回不支持扩展自定义配置，需要自己断言一下
        const res = result as ExpandAxiosResponse
        // 与后端约定的请求成功码
        const code = 200;

        if (res.status < 200 || res.status >= 300) return Promise.reject(res)

        if (res.data.code !== code) {
            if (res.config.requestOptions?.globalErrorMessage) {
                // 这里全局提示错误
                console.error(res.data.msg)
                window.$message.error(res.data.msg)
            }
            return Promise.reject(res.data)
        }
        if (res.config.requestOptions?.globalSuccessMessage) {
            // 这里全局提示请求成功
            console.log(res.data.msg)
        }

        // 请求返回值，建议将 返回值 进行解构
        return res.data.data
    },
    responseInterceptorCatch(err) {
        // 这里用来处理 http 常见错误，进行全局提示
        const mapErrorStatus = new Map([
            [400, '请求方式错误'],
            [401, '请重新登录'],
            [403, '拒绝访问'],
            [404, '请求地址有误'],
            [500, '服务器出错']
        ])
        const msg = mapErrorStatus.get(err.response.status) || '请求出错，请稍后再试'
        // 此处全局报错
        window.$message.error(msg)
        console.error(msg)
        return Promise.reject(err.response.data || err.response)
    }
}

export default new Request({
    baseURL: '/api',
    timeout: 5000,
    interceptorHooks: transform
})