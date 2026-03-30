import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

const reviews: Review[] = [
  {
    id: "1",
    name: "Nino Gelashvili",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    rating: 5,
    text: "Absolutely love the quality of the furniture! The velvet accent chair is even more beautiful in person. Fast delivery too.",
  },
  {
    id: "2",
    name: "Giorgi Kiknadze",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    rating: 5,
    text: "TOCASA has completely transformed my living room. The minimalist designs are exactly what I was looking for. Highly recommend!",
  },
  {
    id: "3",
    name: "Mariam Beridze",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    rating: 4,
    text: "Great selection of home decor items. The ceramic vase set is stunning. Will definitely be ordering more pieces soon.",
  },
  {
    id: "4",
    name: "Luka Tsiklauri",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    rating: 5,
    text: "Premium quality at fair prices. The Scandinavian floor lamp is a masterpiece. Customer service was excellent throughout.",
  },
  {
    id: "5",
    name: "Ana Gabelia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    rating: 5,
    text: "მშვენიერი ხარისხის პროდუქტები! სახლის დეკორი ძალიან მომეწონა, აუცილებლად დავბრუნდები კიდევ.",
  },
  {
    id: "6",
    name: "Dato Meladze",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    rating: 4,
    text: "ძალიან კარგი მომსახურება და სწრაფი მიწოდება. თბილისში საუკეთესო არჩევანია ინტერიერის აქსესუარებისთვის.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-primary text-primary"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export function Reviews() {
  const { t } = useLanguage();

  return (
    <section className="tocasa-section">
      <div className="tocasa-container">
        <div className="text-center mb-8 sm:mb-12">
          <p className="tocasa-subtitle mb-2">{t("reviews.tagline")}</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium">
            {t("reviews.title")}
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="pl-3 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="tocasa-card border-none h-full">
                  <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm sm:text-base text-foreground">
                          {review.name}
                        </p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "{review.text}"
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="-left-4 lg:-left-6" />
            <CarouselNext className="-right-4 lg:-right-6" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
