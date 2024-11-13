import { create } from 'zustand'
import { persist, createJSONStorage }
    from 'zustand/middleware'

const useAppSessionStore = create(
    persist(
        (set, get) => ({
            userdata: {},
            token: '',
            updateToken: (token) =>
                set({ token: token }),
            updateUserData: (userdata) =>
                set({ userdata: userdata }),
        }),
        {
            name: 'formapp-session-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage),
            // (optional) by default, 'localStorage' is used
        },
    ),
)

export default useAppSessionStore;