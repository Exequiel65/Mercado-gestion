import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router';

export default function _layoutWelcome() {
    const navigation = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem("token")) {
            navigation("/");
        }
    }, [navigation]);

    return <Outlet />
}
