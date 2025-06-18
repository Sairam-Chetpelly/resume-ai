import React from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const navItems = [
  { href: "/analyze", label: "Basic Analysis" },
  { href: "/advanced-analysis", label: "Advanced Analysis" },
  { href: "/resume-builder", label: "Resume Builder" },
  { href: "/cover-letter", label: "Cover Letter" },
  { href: "/skill-assessment", label: "Skill Assessment" },
  { href: "/dashboard", label: "Dashboard" },
]

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-2/3 md:w-1/2">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigate through the application features.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {navItems.map((item) => (
            <React.Fragment key={item.label}>
              <Link href={item.href}>
                <Button variant="ghost" className="w-full justify-start">
                  {item.label}
                </Button>
              </Link>
              <Separator />
            </React.Fragment>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
