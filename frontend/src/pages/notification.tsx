import '../styles/App.css';
import '../styles/home.css';
import '../styles/notification.css';
import React, { useEffect, useState } from 'react';
import { useUser } from "../context/userContext";
import { API_BASE_URL } from '../config';
import Header from './header';

const NotificationPage = () => {
    const { user } = useUser();
    const isLoggedIn = user !== null;
    const [leaderTfList, setLeaderTfList] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetch(`${API_BASE_URL}/api/mytfs`, {
                credentials: 'include',
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('TF 목록을 불러오는 데 실패했습니다.');
                }
                return res.json();
            })
            .then(data => {
                setLeaderTfList(data.leaderTFs);
            })
            .catch(err => console.error('TF 목록 불러오기 실패:', err));

            fetch(`${API_BASE_URL}/api/myrequests`, {
                credentials: 'include',
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('내 요청 알림을 불러오는 데 실패했습니다.');
                }
                return res.json();
            })
            .then(data => {
                // console.log(data);
                const requestsWithFormattedDate = data.map((request: any) => ({
                    createdAt: new Date(request.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    requester: user.username,
                    leaderId: request.TF.leaderId,
                    leaderUsername: request.TF.User.username,
                    tfName: request.TF.name,
                    tfId: request.tfId,
                    isConfirmed: request.isConfirmed,
                    id: request.id,
                    isLeader: false
                }));
                setNotifications(
                    requestsWithFormattedDate.sort(
                        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                );
                // console.log(requestsWithFormattedDate);
            })
            .catch(err => console.error('내 요청 알림 불러오기 실패:', err));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn && leaderTfList.length > 0) {
            // 리더인 TF들에 대해 가입 요청 알림 불러오기
            Promise.all(leaderTfList.map(tf =>
                fetch(`${API_BASE_URL}/api/tf/${tf.id}/requests`, {
                    credentials: 'include',
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('가입 요청 알림을 불러오는 데 실패했습니다.');
                    }
                    return res.json().then(requests => {
                        const requestsWithTfName = requests.map((request: any) => ({
                            createdAt: new Date(request.createdAt).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                            requester: request.User.username,
                            leaderId: user.id,
                            leaderUsername: user.username,
                            tfName: tf.name,
                            tfId: tf.id,
                            isConfirmed: request.isConfirmed,
                            id: request.id,
                            isLeader: true
                        }));
                        return requestsWithTfName;
                    });
                })
            ))
            .then(results => {
                // 여러 TF에서 온 요청들을 하나의 배열로 합치기
                const allRequests = results.flat();
                setNotifications(prevNotifications =>
                    [...prevNotifications, ...allRequests].sort(
                        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                );
                // console.log(allRequests);
            })
            .catch(err => console.error('가입 요청 알림 불러오기 실패:', err));
        }
    }, [leaderTfList]);

    const handleAccept = (id: number, tfId: number) => {
        // 수락 처리 로직
        fetch(`${API_BASE_URL}/api/tf/${tfId}/requests/${id}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ action: 'approve' }),
            headers: { "Content-Type": "application/json" }
        })
        .then(res => {
            if (res.ok) {
                alert(`참가 요청을 수락했습니다.`);
                window.location.reload();
            } else {
                alert('요청 수락에 실패했습니다.');
            }
        }).catch(err => {
            console.error('요청 수락 실패:', err);
            alert('요청 수락에 실패했습니다.');
        });
    };

    const handleReject = (id: number, tfId: number) => {
        fetch(`${API_BASE_URL}/api/tf/${tfId}/requests/${id}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ action: 'reject' }),
            headers: { "Content-Type": "application/json" }
        })
        .then(res => {
            if (res.ok) {
                alert(`참가 요청을 거절했습니다.`);
                window.location.reload();
            } else {
                alert('요청 거절에 실패했습니다.');
            }
        }).catch(err => {
            console.error('요청 거절 실패:', err);
            alert('요청 거절에 실패했습니다.');
        });
    };

    const handleConfirm = (id: number) => {
        // 확인 처리 로직
        fetch(`${API_BASE_URL}/api/notifications/${id}/confirm`, {
            method: 'POST',
            credentials: 'include',
        })
        .then(res => {
            if (res.ok) {
                window.location.reload();
            }
            else {
                alert('알림 확인에 실패했습니다.');
            }
        })
        .catch(err => {
            console.error('알림 확인 실패:', err);
            alert('알림 확인에 실패했습니다.');
        });
    };

    return (
        <div className='page-wrapper'>
            <Header />
            <main className="notification-main">
                <h2 className='section-title'>알림</h2>
                {
                    notifications.length === 0 ? (
                        <p className='no-notifications'>현재 알림이 없습니다.</p>
                    ) : null
                }
                {
                    notifications.length > 0 ? (
                        <table className='notification-table'>
                            <thead className='notification-thead'>
                                <tr>
                                    <th>요청 일자</th>
                                    <th>요청자</th>
                                    <th>참가 희망 TF</th>
                                    <th>TF 담당자</th>
                                    <th>상태</th>
                                    {notifications.some(n => !n.isLeader && (n.isConfirmed === 1 || n.isConfirmed === 2)) && <th></th>}
                                </tr>
                            </thead>
                            <tbody className='notification-tbody'>
                                {notifications.map((notification) => (
                                    <tr key={notification.id}>
                                        <td>{notification.createdAt}</td>
                                        <td>{notification.requester}</td>
                                        <td>{notification.tfName}</td>
                                        <td>{notification.leaderUsername}</td>
                                        { notification.isLeader && notification.isConfirmed === 0 &&
                                            <td>
                                                <button className='approve-button' onClick={() => handleAccept(notification.id, notification.tfId)}>수락</button>
                                                <button className='reject-button' onClick={() => handleReject(notification.id, notification.tfId)}>거절</button>
                                            </td>
                                        }
                                        { !notification.isLeader &&
                                            <td>
                                                { notification.isConfirmed === 0 && '대기 중' }
                                                { notification.isConfirmed === 1 && '수락됨' }
                                                { notification.isConfirmed === 2 && '거절됨' }
                                            </td>
                                        }
                                        { !notification.isLeader && ( notification.isConfirmed == 1 || notification.isConfirmed == 2 ) &&
                                            <td>
                                                <button className='confirm-button' onClick={() => handleConfirm(notification.id)}>확인</button>
                                            </td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : null
                }
            </main>
        </div>
    );
}

export default NotificationPage;