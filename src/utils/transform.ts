import * as _ from 'lodash'

/**
 * 列表转树
 */
export const arrayToTree = (propData: any) => {
    // 深拷贝
    const data = _.cloneDeep(propData);
    // * 先生成parent建立父子关系
    const obj: any = {};
    data.forEach((item: any) => {
        obj[item.id] = item;
    });
    const parentList: any[] = [];
    data.forEach((item: any) => {
        const parent = obj[item.parentId];
        if (parent) {
            // * 当前项有父节点
            parent.children = parent.children || [];
            parent.children.push(item);
        } else {
            // * 当前项没有父节点 -> 顶层
            parentList.push(item);
        }
    });
    return parentList;
}