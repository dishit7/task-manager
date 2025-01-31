import { CheckCircle, Calendar, Layers } from "lucide-react"

const features = [
  {
    icon: CheckCircle,
    title: "Task Management",
    description: "Easily create, organize, and prioritize your tasks with our intuitive interface.",
  },
  {
    icon: Layers,
    title: "Project Organization",
    description: "Group related tasks into projects for better organization and clarity.",
  },
  {
    icon: Calendar,
    title: "Calendar Integration",
    description: "Seamlessly sync your tasks with your calendar for efficient time management.",
  },
]

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-[#121212]">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 dark:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

