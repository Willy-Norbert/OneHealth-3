import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pill, ShoppingCart, Heart, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PharmacyProducts() {
  const { t } = useLanguage();

  const categories = [
    t("pharmacy_products.categories.prescription"),
    t("pharmacy_products.categories.otc"),
    t("pharmacy_products.categories.chronic"),
    t("pharmacy_products.categories.vitamins"),
    t("pharmacy_products.categories.personal_care"),
    t("pharmacy_products.categories.devices"),
    t("pharmacy_products.categories.first_aid"),
    t("pharmacy_products.categories.baby_maternal"),
  ];

  const featuredProducts = [
    {
      name: t("pharmacy_products.featured.bp_monitor.name"),
      category: t("pharmacy_products.featured.bp_monitor.category"),
      image: "/placeholder.svg?height=200&width=200&text=BP+Monitor",
      price: "RWF 45,000",
      rating: 4.8,
      reviews: 124,
    },
    {
      name: t("pharmacy_products.featured.multivitamin.name"),
      category: t("pharmacy_products.featured.multivitamin.category"),
      image: "/placeholder.svg?height=200&width=200&text=Multivitamin",
      price: "RWF 12,500",
      rating: 4.6,
      reviews: 89,
    },
    {
      name: t("pharmacy_products.featured.diabetes_strips.name"),
      category: t("pharmacy_products.featured.diabetes_strips.category"),
      image: "/placeholder.svg?height=200&width=200&text=Test+Strips",
      price: "RWF 18,000",
      rating: 4.9,
      reviews: 203,
    },
    {
      name: t("pharmacy_products.featured.first_aid_kit.name"),
      category: t("pharmacy_products.featured.first_aid_kit.category"),
      image: "/placeholder.svg?height=200&width=200&text=First+Aid+Kit",
      price: "RWF 22,000",
      rating: 4.7,
      reviews: 156,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("pharmacy_products.heading")}{" "}
            <span className="text-purple-600">{t("pharmacy_products.highlight")}</span>
          </h2>
          <p className="text-xl text-gray-600">{t("pharmacy_products.description")}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-6 py-3 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300 text-gray-800 font-medium border border-gray-200"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Products */}
        <h3 className="text-2xl font-bold text-gray-900 mb-8">{t("pharmacy_products.featured_heading")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <div className="aspect-square relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover p-4"
                  />
                </div>
                <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                  <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="text-sm text-purple-600 font-medium mb-2">{product.category}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h4>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-600">{product.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-600">{product.reviews} {t("pharmacy_products.reviews")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <ShoppingCart className="h-4 w-4 mr-1" /> {t("pharmacy_products.add_to_cart")}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-purple-600 hover:bg-purple-700">
            {t("pharmacy_products.view_all")} <Pill className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
