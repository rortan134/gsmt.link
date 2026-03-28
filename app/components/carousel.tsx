"use client";

import * as React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Carousel = ({ children }: React.PropsWithChildren) => (
    <Swiper
        className="overflow-visible! relative w-full"
        grabCursor
        modules={[Mousewheel, Navigation, Pagination]}
        mousewheel={{ forceToAxis: true, sensitivity: 3 }}
        pagination={{
            bulletActiveClass: "text-white! bg-red-500! px-2!",
            bulletClass:
                "transition-[padding] select-none text-muted-foreground size-7 flex items-center justify-center text-xs rounded-lg bg-card cursor-pointer font-medium",
            clickable: true,
            el: ".swiper-pagination-container",
            enabled: true,
            renderBullet: (index, className) =>
                `<span class="${className}">${index + 1}</span>`,
        }}
        slidesPerView="auto"
        spaceBetween={12}
    >
        {React.Children.map(children, (child) => (
            <SwiperSlide className="relative size-full max-w-xs overflow-hidden rounded-xl bg-card">
                {child}
            </SwiperSlide>
        ))}
        <div className="swiper-pagination-container flex items-center space-x-1.5 pt-4" />
    </Swiper>
);

export { Carousel };
