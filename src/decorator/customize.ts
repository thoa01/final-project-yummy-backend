import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true) //định nghĩa 1 decorator --> truyền metadata(thông tin đính kèm) vào lời gọi request //SetMetadata(key, value) //key:value //dùng để disable jwt guard
export const RESPONSE_MESSAGE = 'response_message'
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message)
