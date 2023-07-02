import { useEffect, useState } from 'react'
import axios from 'axios'

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl)
      .then(response => {
        setResources(response.data)
        console.log(response.data)
      })
  }, [baseUrl])

  const create = (resource) => {
    axios.post(baseUrl, resource)
          .then(response => {
            setResources(resources.concat(response.data))
          })
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}