import { useEffect, useState } from "react";
import { useApi } from "./useApi";

export const UseRankings = () => {
    const [rankings, setRankings] = useState([]);
    const{ getRankings } = useApi();

    useEffect(() => {
        getRankings().then((data) => {
            if (data?.rankings) {
                setRankings(data.rankings)
            }
        })
    }, [])

    return { rankings }
}