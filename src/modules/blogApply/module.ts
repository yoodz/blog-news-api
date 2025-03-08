export default interface IModules {
    /** rss 地址 */
    rssUrl: string
    /** 标题 */
    title: string
    /** 爬取出错次数 */
    errorCount: number
    /** 审核状态 0 审核中 1 审核通过 2 审核失败 */
    status: number
    /** 是否删除 0 未删除 1 删除 */
    deleted: number
    /** 是否初始化 0 未初始化 1 已初始化 */
    init: number
    email: string
    updateAt: number
}