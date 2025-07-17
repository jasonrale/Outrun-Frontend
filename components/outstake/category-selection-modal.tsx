"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CategorySelectionModalProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategorySelectionModal({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectionModalProps) {
  const allCategories = categories

  const handleCategorySelect = (category: string) => {
    onSelectCategory(category)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="fixed bottom-0 left-0 right-0 top-auto w-full max-w-none rounded-t-2xl border-0 p-0
                   bg-gradient-to-b from-[#1a0a3d] via-[#2a145c] to-[#1a0a3d] shadow-[0_-10px_40px_rgba(168,85,247,0.3)]"
      >
        <div className="p-6 space-y-4">
          {/* Handle bar */}
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4" />

          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Select Category
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {allCategories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className={`w-full justify-center py-4 text-base font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.2)]"
                    : "text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
