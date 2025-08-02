import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import api from "~/services/api"
import { useEntityStore, type Entity } from "~/store/entity-store"


export default function _layoutMain() {
  const { setEntity, setHydrated, isHydrated } = useEntityStore()
  const navigate = useNavigate()
  const fetchEntity = async () => {
      try {
        const res = await api.get("web/status")
        setEntity(res.data.data)
      } catch (e) {
        console.error("Error fetching entity", e)
        navigate("/")
      } finally {
        setHydrated(true)
      }
    }

  useEffect(() => {
    const fetchFirstData = async () => {
      await fetchEntity()
    }

    fetchFirstData()
  }, [])

  if (!isHydrated) return null

  return <Outlet />
}
