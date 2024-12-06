import AnonymousPost from './anonymous-card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Anonymous Posts</h1>
      <div className="space-y-6">
        <AnonymousPost
          
          content="I sometimes dream about being a superhero, but then I remember I can't even decide what to have for dinner."
          timestamp="2 hours ago"
        />
        <AnonymousPost
         
          content="I pretend to understand cryptocurrency, but in reality, I have no idea how it works."
          timestamp="5 hours ago"
        />
      </div>
    </div>
  )
}

