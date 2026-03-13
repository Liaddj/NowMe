import {
useQuery,
useMutation,
useQueryClient,
useInfiniteQuery,
Mutation,
} from '@tanstack/react-query'

import { createUserAccount, signInAccount } from '../appwrite/api'
import type { INewUser } from '@/types'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSingInAccount = () => {
    return useMutation({
        mutationFn: (user:{
            email: string
            password: string
        }) => signInAccount(user)
    })
}

