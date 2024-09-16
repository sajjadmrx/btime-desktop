import { NewsCard } from './newsCard'
import { News } from '../../../api/api.interface'
import { useEffect, useState } from 'react'
import { getOurNews } from '../../../api/api'

export function NewsDisplay() {
  const [news, setNews] = useState<News[]>([])

  useEffect(() => {
    async function fetchNews() {
      const data = await getOurNews()
      setNews(data)
    }

    fetchNews()
  }, [])

  return (
    <div className="mt-1 overflow-x-hidden">
      {news.length
        ? news.map((news, index) => (
            <NewsCard key={index.toString()} news={news} />
          ))
        : null}
    </div>
  )
}
