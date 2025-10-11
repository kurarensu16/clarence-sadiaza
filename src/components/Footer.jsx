const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Clarence Sadiaza. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              LinkedIn
            </a>
            <a href="https://kurarensu16.github.io" className="text-gray-400 hover:text-white transition-colors duration-300">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Dribbble
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer