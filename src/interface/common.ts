export interface IResult {
    /** 文章标题 */
    title: string
    /** 文章地址 */
    link: string
    /** 发布时间 */
    pubDate: string
    /** 网站域名 */
    hostname: string
    pv: number
    like: number
    createAt: number
}