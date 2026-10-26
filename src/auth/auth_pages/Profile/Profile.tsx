import { useQuery } from '@tanstack/react-query'
import styles from './Profile.module.css'
import { api } from '../../../api'
import { useContext } from 'react'
import { authContext } from '../../context'



interface ProfileResponse {
    user_id: number,
    username: string,
    email: string,
    plus_count: number,
    minus_count: number
}



export function Profile(){

    const authEntities = useContext(authContext)

    const {data} = useQuery<ProfileResponse>({
        queryKey:['user',authEntities?.user_id],
        queryFn:async function() {
            const result = await api.get('/user/profile')
            return result.data
        },        
    })

    const initial = data?.username?.[0]?.toUpperCase() ?? '?'

    return (
        <div className={styles.Outer}>
            <div className={styles.UserCard}>
                <div className={styles.Avatar}>{initial}</div>
                <p className={styles.Username}>{data?.username ?? '—'}</p>
                <p className={styles.Email}>{data?.email ?? '—'}</p>

                <div className={styles.InfoRow}>
                    <span>ID</span>
                    <span>{data?.user_id}</span>
                </div>

                <div className={styles.StatsRow}>
                    <div className={`${styles.StatBadge} ${styles.Plus}`}>
                        <span className={styles.StatValue}>{data?.plus_count ?? 0}</span>
                        <span>плюсов</span>
                    </div>
                    <div className={`${styles.StatBadge} ${styles.Minus}`}>
                        <span className={styles.StatValue}>{data?.minus_count ?? 0}</span>
                        <span>минусов</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
