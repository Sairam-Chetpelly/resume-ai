import Link from "next/link"

const navItems = [
  { href: "/analyze", label: "Basic Analysis" },
  { href: "/advanced-analysis", label: "Advanced Analysis" },
  { href: "/resume-builder", label: "Resume Builder" },
  { href: "/cover-letter", label: "Cover Letter" },
  { href: "/skill-assessment", label: "Skill Assessment" },
  { href: "/dashboard", label: "Dashboard" },
]

const Header = () => {
  return (
    <header className="bg-gray-100 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AI Career Tools
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gray-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
