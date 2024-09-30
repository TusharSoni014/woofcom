import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About WoofCom</h3>
            <p className="text-sm">
              WoofCom is your one-stop shop for stylish and comfortable clothes
              and accessories.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} WoofCom. All rights reserved.</p>
          <p className="mt-2">
            Designed by{" "}
            <Link
              href="https://tusharsoni.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Tushar Soni
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
