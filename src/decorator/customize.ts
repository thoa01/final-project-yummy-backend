import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

//định nghĩa 1 decorator --> truyền metadata(thông tin đính kèm) vào lời gọi request
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true) //SetMetadata(key, value) //key:value //dùng để disable jwt guard
