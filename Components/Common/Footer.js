export default function Footer() {
    return (
      <footer className="bg-[#4CAF50] text-white py-8">
        <div className="max-w-[1200px] mx-auto w-[92%] text-center">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Meal Management System. All rights reserved.
          </p>
          <p className="text-xs mt-1">Designed & Developed by Md Naimur Rahman Sant</p>
        </div>
      </footer>
    );
  }
  