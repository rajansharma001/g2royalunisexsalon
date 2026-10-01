      document.addEventListener("DOMContentLoaded", () => {
        /* 1. BEFORE & AFTER COMPARISON SLIDERS */
        function setupBeforeAfterSlider(containerId, clipId, handleId) {
          const container = document.getElementById(containerId);
          const clip = document.getElementById(clipId);
          const handle = document.getElementById(handleId);
          if (!container || !clip || !handle) return;

          let isDragging = false;
          let currentPercent = 50;

          function setPositionPercent(percentage) {
            currentPercent = Math.max(5, Math.min(95, percentage));
            clip.style.clipPath = `polygon(0 0, ${currentPercent}% 0, ${currentPercent}% 100%, 0 100%)`;
            clip.style.webkitClipPath = `polygon(0 0, ${currentPercent}% 0, ${currentPercent}% 100%, 0 100%)`;
            handle.style.left = `${currentPercent}%`;
            container.setAttribute("aria-valuenow", Math.round(currentPercent));
          }

          function updateSliderPosition(clientX) {
            const rect = container.getBoundingClientRect();
            if (rect.width <= 0) return;
            const posX = clientX - rect.left;
            const percentage = (posX / rect.width) * 100;
            setPositionPercent(percentage);
          }

          container.addEventListener("pointerdown", (e) => {
            isDragging = true;
            try {
              container.setPointerCapture(e.pointerId);
            } catch (_) {}
            updateSliderPosition(e.clientX);
          });

          container.addEventListener("pointermove", (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.clientX);
          });

          const endDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            try {
              container.releasePointerCapture(e.pointerId);
            } catch (_) {}
          };

          container.addEventListener("pointerup", endDrag);
          container.addEventListener("pointercancel", endDrag);

          // Accessible Keyboard Navigation
          container.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              setPositionPercent(currentPercent - 5);
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              setPositionPercent(currentPercent + 5);
            } else if (e.key === "Home") {
              e.preventDefault();
              setPositionPercent(5);
            } else if (e.key === "End") {
              e.preventDefault();
              setPositionPercent(95);
            }
          });

          // Initial position
          setPositionPercent(50);
        }

        // Initialize sliders across pages
        setupBeforeAfterSlider("baSlider1", "baClip1", "baHandle1");
        setupBeforeAfterSlider("baSlider2", "baClip2", "baHandle2");
        setupBeforeAfterSlider("baSlider3", "baClip3", "baHandle3");
        setupBeforeAfterSlider("baSlider4", "baClip4", "baHandle4");
        setupBeforeAfterSlider("baGallerySlider1", "baGalleryClip1", "baGalleryHandle1");
        setupBeforeAfterSlider("baGallerySlider2", "baGalleryClip2", "baGalleryHandle2");

        /* 2. SERVICES TAB FILTERING */
        const serviceTabs = document.querySelectorAll(".service-tab-btn");
        const serviceCards = document.querySelectorAll(".service-card");

        serviceTabs.forEach((tab) => {
          tab.addEventListener("click", () => {
            serviceTabs.forEach((t) => t.classList.remove("is-active"));
            tab.classList.add("is-active");

            const category = tab.getAttribute("data-category");
            let visibleIndex = 0;
            serviceCards.forEach((card) => {
              const cardType = card.getAttribute("data-service-type");
              if (category === "all" || category === cardType) {
                card.style.display = "";
                card.style.opacity = "0";
                card.style.transform = "scale(0.97) translateY(12px)";
                const delay = visibleIndex * 50;
                visibleIndex++;
                window.setTimeout(() => {
                  card.style.transition =
                    "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
                  card.style.opacity = "1";
                  card.style.transform = "none";
                }, delay);
              } else {
                card.style.display = "none";
              }
            });
          });
        });

        /* 3. INSTRUCTORS CAROUSEL NAVIGATION & DOTS */
        const instructorsTrack = document.getElementById("instructorsTrack");
        const prevHeader = document.getElementById("instructorPrevHeader");
        const nextHeader = document.getElementById("instructorNextHeader");
        const instructorDots = document.getElementById("instructorDots");
        const scrollStep = 320;

        function scrollInstructors(direction) {
          if (!instructorsTrack) return;
          instructorsTrack.scrollBy({
            left: direction * scrollStep,
            behavior: "smooth",
          });
        }

        if (prevHeader)
          prevHeader.addEventListener("click", () => scrollInstructors(-1));
        if (nextHeader)
          nextHeader.addEventListener("click", () => scrollInstructors(1));

        if (instructorsTrack && instructorDots) {
          const dots = instructorDots.querySelectorAll("button");
          instructorsTrack.addEventListener("scroll", () => {
            const cardWidth = 300;
            const activeIdx = Math.min(
              Math.round(instructorsTrack.scrollLeft / cardWidth),
              dots.length - 1
            );
            dots.forEach((dot, idx) => {
              if (idx === activeIdx) {
                dot.className = "w-4 h-2 rounded-full bg-[#d4af37] transition-all";
              } else {
                dot.className = "w-2 h-2 rounded-full bg-white/20 transition-all";
              }
            });
          });

          dots.forEach((dot, idx) => {
            dot.addEventListener("click", () => {
              instructorsTrack.scrollTo({
                left: idx * scrollStep,
                behavior: "smooth",
              });
            });
          });
        }

        /* 3B. TRANSFORMATION VIDEOS CAROUSEL NAVIGATION & DOTS */
        const videoCarouselTrack = document.getElementById("videoCarouselTrack");
        const videoPrevBtn = document.getElementById("videoPrevBtn");
        const videoNextBtn = document.getElementById("videoNextBtn");
        const videoDots = document.getElementById("videoDots");
        const videoScrollStep = 264;

        function scrollVideos(direction) {
          if (!videoCarouselTrack) return;
          videoCarouselTrack.scrollBy({
            left: direction * videoScrollStep,
            behavior: "smooth",
          });
        }

        if (videoPrevBtn)
          videoPrevBtn.addEventListener("click", () => scrollVideos(-1));
        if (videoNextBtn)
          videoNextBtn.addEventListener("click", () => scrollVideos(1));

        if (videoCarouselTrack && videoDots) {
          const vDots = videoDots.querySelectorAll("button");
          videoCarouselTrack.addEventListener("scroll", () => {
            const cardWidth = 264;
            const activeIdx = Math.min(
              Math.round(videoCarouselTrack.scrollLeft / cardWidth),
              vDots.length - 1
            );
            vDots.forEach((dot, idx) => {
              if (idx === activeIdx) {
                dot.className = "w-4 h-2 rounded-full bg-[#d4af37] transition-all";
              } else {
                dot.className = "w-2 h-2 rounded-full bg-stone-300 transition-all";
              }
            });
          });

          vDots.forEach((dot, idx) => {
            dot.addEventListener("click", () => {
              videoCarouselTrack.scrollTo({
                left: idx * videoScrollStep,
                behavior: "smooth",
              });
            });
          });
        }

        /* 3C. TESTIMONIALS CAROUSEL NAVIGATION */
        const testimonialsTrack = document.getElementById("testimonialsTrack");
        const testimonialPrevBtn = document.getElementById("testimonialPrevBtn");
        const testimonialNextBtn = document.getElementById("testimonialNextBtn");
        const testimonialScrollStep = 380;

        function scrollTestimonials(direction) {
          if (!testimonialsTrack) return;
          testimonialsTrack.scrollBy({
            left: direction * testimonialScrollStep,
            behavior: "smooth",
          });
        }

        if (testimonialPrevBtn)
          testimonialPrevBtn.addEventListener("click", () => scrollTestimonials(-1));
        if (testimonialNextBtn)
          testimonialNextBtn.addEventListener("click", () => scrollTestimonials(1));

        /* 4. VIDEO MODAL PLAYER */
        const videoModal = document.getElementById("videoModal");
        const closeVideoModalBtn = document.getElementById("closeVideoModalBtn");
        const modalVideoPlayer = document.getElementById("modalVideoPlayer");
        const modalPlayToggleBtn = document.getElementById("modalPlayToggleBtn");
        const modalPlayIcon = document.getElementById("modalPlayIcon");
        const modalVideoTitle = document.getElementById("modalVideoTitle");
        const modalVideoAuthor = document.getElementById("modalVideoAuthor");
        const videoProgressBar = document.getElementById("videoProgressBar");
        const videoProgressBarContainer = document.getElementById(
          "videoProgressBarContainer",
        );
        const videoCurrentTime = document.getElementById("videoCurrentTime");
        const modalMuteBtn = document.getElementById("modalMuteBtn");
        const modalMuteIcon = document.getElementById("modalMuteIcon");
        const modalInquireBtn = document.getElementById("modalInquireBtn");
        const videoTriggers = document.querySelectorAll(".video-trigger");

        function openStoryModal(title, author, poster) {
          if (!videoModal) return;
          modalVideoTitle.textContent = title || "Client Transformation";
          modalVideoAuthor.textContent = author || "G2 Signature Treatment";
          if (poster && modalVideoPlayer) {
            modalVideoPlayer.poster = poster;
          }
          videoModal.classList.remove("hidden");
          videoModal.classList.add("flex");
          document.body.style.overflow = "hidden";

          modalVideoPlayer
            .play()
            .then(() => {
              modalPlayIcon.className =
                "fa-solid fa-pause text-lg ml-0.5 text-[#e5e7eb]";
              modalPlayToggleBtn.style.opacity = "0";
            })
            .catch(() => {
              modalPlayIcon.className =
                "fa-solid fa-play text-lg ml-0.5 text-[#e5e7eb]";
              modalPlayToggleBtn.style.opacity = "1";
            });
        }

        function closeStoryModal() {
          if (!videoModal) return;
          if (modalVideoPlayer) {
            modalVideoPlayer.pause();
            modalVideoPlayer.currentTime = 0;
          }
          videoModal.classList.add("hidden");
          videoModal.classList.remove("flex");
          document.body.style.overflow = "";
        }

        videoTriggers.forEach((trigger) => {
          trigger.addEventListener("click", () => {
            openStoryModal(
              trigger.getAttribute("data-video-title"),
              trigger.getAttribute("data-video-author"),
              trigger.getAttribute("data-video-poster"),
            );
          });
        });

        if (closeVideoModalBtn)
          closeVideoModalBtn.addEventListener("click", closeStoryModal);
        if (videoModal) {
          videoModal.addEventListener("click", (e) => {
            if (e.target === videoModal) closeStoryModal();
          });
        }

        if (modalPlayToggleBtn) {
          modalPlayToggleBtn.addEventListener("click", () => {
            if (modalVideoPlayer.paused) {
              modalVideoPlayer.play();
              modalPlayIcon.className =
                "fa-solid fa-pause text-lg ml-0.5 text-[#e5e7eb]";
              modalPlayToggleBtn.style.opacity = "0";
            } else {
              modalVideoPlayer.pause();
              modalPlayIcon.className =
                "fa-solid fa-play text-lg ml-0.5 text-[#e5e7eb]";
              modalPlayToggleBtn.style.opacity = "1";
            }
          });
        }

        if (modalVideoPlayer) {
          modalVideoPlayer.addEventListener("timeupdate", () => {
            if (!modalVideoPlayer.duration) return;
            const prog =
              (modalVideoPlayer.currentTime / modalVideoPlayer.duration) * 100;
            videoProgressBar.style.width = `${prog}%`;
            const mins = Math.floor(modalVideoPlayer.currentTime / 60);
            const secs = Math.floor(modalVideoPlayer.currentTime % 60);
            videoCurrentTime.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
          });
        }

        if (videoProgressBarContainer) {
          videoProgressBarContainer.addEventListener("click", (e) => {
            const rect = videoProgressBarContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (modalVideoPlayer.duration) {
              modalVideoPlayer.currentTime = pos * modalVideoPlayer.duration;
            }
          });
        }

        if (modalMuteBtn) {
          modalMuteBtn.addEventListener("click", () => {
            modalVideoPlayer.muted = !modalVideoPlayer.muted;
            modalMuteIcon.className = modalVideoPlayer.muted
              ? "fa-solid fa-volume-xmark text-xs"
              : "fa-solid fa-volume-high text-xs";
          });
        }

        if (modalInquireBtn) {
          modalInquireBtn.addEventListener("click", () => {
            const lookTitle = modalVideoTitle
              ? modalVideoTitle.textContent.trim()
              : "Signature Transformation";
            closeStoryModal();
            openBookingModal(lookTitle);
          });
        }

        /* 5. APPOINTMENT RESERVATIONS & DRAWER */
        const bookingModal = document.getElementById("bookingModal");
        const closeBookingBtn = document.getElementById("closeBookingBtn");
        const navBookBtn = document.getElementById("navBookBtn");
        const heroBookBtn = document.getElementById("heroBookBtn");
        const openReservationHeaderBtn = document.getElementById(
          "openReservationHeaderBtn",
        );
        const bookingForm = document.getElementById("bookingForm");
        const floatingMobileBtn = document.getElementById("floatingMobileBtn");
        const conciergeDrawer = document.getElementById("conciergeDrawer");
        const closeDrawerBtn = document.getElementById("closeDrawerBtn");
        const drawerBookBtn = document.getElementById("drawerBookBtn");
        const drawerApplyBtn = document.getElementById("drawerApplyBtn");

        function openBookingModal(serviceName) {
          if (!bookingModal) return;
          if (serviceName) {
            const serviceSelect = document.getElementById("bookingServiceSelect");
            if (serviceSelect) {
              let matched = false;
              for (let i = 0; i < serviceSelect.options.length; i++) {
                const optText = serviceSelect.options[i].text.toLowerCase();
                const optVal = serviceSelect.options[i].value.toLowerCase();
                const target = serviceName.toLowerCase();
                if (optText.includes(target) || target.includes(optVal) || target.includes(optText)) {
                  serviceSelect.selectedIndex = i;
                  matched = true;
                  break;
                }
              }
              if (!matched) {
                const customOpt = new Option(serviceName, serviceName, true, true);
                serviceSelect.add(customOpt);
              }
            }
          }
          bookingModal.classList.remove("hidden");
          bookingModal.classList.add("flex");
          document.body.style.overflow = "hidden";
        }

        function closeBookingModal() {
          if (!bookingModal) return;
          bookingModal.classList.add("hidden");
          bookingModal.classList.remove("flex");
          document.body.style.overflow = "";
        }

        if (navBookBtn) navBookBtn.addEventListener("click", () => openBookingModal());
        if (heroBookBtn)
          heroBookBtn.addEventListener("click", () => openBookingModal());
        if (openReservationHeaderBtn)
          openReservationHeaderBtn.addEventListener("click", () => openBookingModal());
        if (closeBookingBtn)
          closeBookingBtn.addEventListener("click", closeBookingModal);

        /* Contextual Service Card Booking */
        const bookServiceBtns = document.querySelectorAll(".book-service-btn");
        bookServiceBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const service = btn.getAttribute("data-service");
            openBookingModal(service);
          });
        });

        /* (Persona Switcher unused) */

        if (bookingModal) {
          bookingModal.addEventListener("click", (e) => {
            if (e.target === bookingModal) closeBookingModal();
          });
        }

        if (bookingForm) {
          bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            closeBookingModal();
            bookingForm.reset();
            showToast(
              "Appointment request received! Our concierge will call within 30 minutes.",
              "fa-calendar-check",
            );
          });
        }

        /* Concierge Drawer */
        if (conciergeDrawer) {
          if (closeDrawerBtn) {
            closeDrawerBtn.addEventListener("click", () => {
              conciergeDrawer.classList.add("hidden");
              conciergeDrawer.classList.remove("flex");
            });
          }
          conciergeDrawer.addEventListener("click", (e) => {
            if (e.target === conciergeDrawer) {
              conciergeDrawer.classList.add("hidden");
              conciergeDrawer.classList.remove("flex");
            }
          });
          if (drawerBookBtn) {
            drawerBookBtn.addEventListener("click", () => {
              conciergeDrawer.classList.add("hidden");
              conciergeDrawer.classList.remove("flex");
              openBookingModal();
            });
          }
          if (drawerApplyBtn) {
            drawerApplyBtn.addEventListener("click", () => {
              conciergeDrawer.classList.add("hidden");
              conciergeDrawer.classList.remove("flex");
            });
          }
        }

        /* 6. ACADEMY APPLICATION FORM */
        const academyApplyForm = document.getElementById("academyApplyForm");
        if (academyApplyForm) {
          academyApplyForm.addEventListener("submit", (e) => {
            e.preventDefault();
            academyApplyForm.reset();
            showToast(
              "Application logged! Admissions office will contact you with batch dates.",
              "fa-graduation-cap",
            );
          });
        }

        /* 6B. CONTEXTUAL ACADEMY TRACK SELECTION */
        const selectCourseBtns = document.querySelectorAll(".select-course-btn");
        const academyTrackSelect = document.getElementById("academyTrackSelect");
        selectCourseBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            const courseName = btn.getAttribute("data-course");
            if (academyTrackSelect && courseName) {
              for (let i = 0; i < academyTrackSelect.options.length; i++) {
                if (
                  academyTrackSelect.options[i].text.toLowerCase().includes(courseName.toLowerCase()) ||
                  academyTrackSelect.options[i].value.toLowerCase().includes(courseName.toLowerCase()) ||
                  courseName.toLowerCase().includes(academyTrackSelect.options[i].value.toLowerCase())
                ) {
                  academyTrackSelect.selectedIndex = i;
                  break;
                }
              }
            }
            const formDesk = document.getElementById("quickApplyCard");
            if (formDesk) {
              formDesk.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          });
        });

        /* 7. STUDIO MAP (Native Google Maps iframe) */

        /* 8. MOBILE HAMBURGER MENU */
        const mobileMenuToggle = document.getElementById("mobileMenuToggle");
        const mobileMenu = document.getElementById("mobileMenu");
        if (mobileMenuToggle && mobileMenu) {
          mobileMenuToggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
          });
          mobileMenu.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", () =>
              mobileMenu.classList.add("hidden"),
            );
          });
        }

        /* 9. TOAST NOTIFICATION UTILITY */
        const toast = document.getElementById("toastNotification");
        const toastMsg = document.getElementById("toastMessage");
        const toastIcon = document.getElementById("toastIcon");
        let toastTimer = null;

        function showToast(message, iconClass = "fa-circle-check") {
          if (!toast || !toastMsg) return;
          clearTimeout(toastTimer);
          toastMsg.textContent = message;
          toastIcon.className = `fa-solid ${iconClass} text-[#d4af37] text-base`;
          toast.classList.remove("translate-y-20", "opacity-0");
          toast.classList.add("translate-y-0", "opacity-100");
          toastTimer = setTimeout(() => {
            toast.classList.remove("translate-y-0", "opacity-100");
            toast.classList.add("translate-y-20", "opacity-0");
          }, 3400);
        }


        /* 11. FAQ ACCORDION HANDLER */
        const faqQuestions = document.querySelectorAll(".faq-question");
        faqQuestions.forEach((qBtn) => {
          qBtn.addEventListener("click", () => {
            const item = qBtn.closest(".faq-item");
            if (!item) return;
            const isOpen = item.classList.contains("is-open");
            const parentAccordion = item.closest(".faq-accordion");
            if (parentAccordion) {
              parentAccordion.querySelectorAll(".faq-item").forEach((other) => {
                if (other !== item) other.classList.remove("is-open");
              });
            }
            if (isOpen) {
              item.classList.remove("is-open");
            } else {
              item.classList.add("is-open");
            }
          });
        });

        /* 12. PURE IMAGE GALLERY LIGHTBOX (KEYBOARD ARROWS & PREV/NEXT BUTTONS) */
        const pureModal = document.getElementById("pureImageModal");
        const pureImg = document.getElementById("pureLightboxImg");
        const closePureBtn = document.getElementById("closePureLightboxBtn");
        const prevPureBtn = document.getElementById("prevPureLightboxBtn");
        const nextPureBtn = document.getElementById("nextPureLightboxBtn");
        const pureItems = document.querySelectorAll(".gallery-pure-item");

        let visibleGalleryItems = [];
        let currentGalleryIdx = 0;

        function refreshVisibleGalleryItems() {
          visibleGalleryItems = Array.from(document.querySelectorAll(".gallery-pure-item")).filter(
            (item) => window.getComputedStyle(item).display !== "none"
          );
        }

        function showGalleryImg(index) {
          if (!visibleGalleryItems.length) refreshVisibleGalleryItems();
          if (!visibleGalleryItems.length || !pureImg) return;
          if (index < 0) index = visibleGalleryItems.length - 1;
          if (index >= visibleGalleryItems.length) index = 0;
          currentGalleryIdx = index;
          const targetEl = visibleGalleryItems[currentGalleryIdx];
          const imgEl = targetEl ? targetEl.querySelector("img") : null;
          if (imgEl) {
            pureImg.src = imgEl.src;
            pureImg.alt = imgEl.alt || "Gallery image preview";
          }
        }

        pureItems.forEach((item) => {
          item.addEventListener("click", () => {
            refreshVisibleGalleryItems();
            const idx = visibleGalleryItems.indexOf(item);
            showGalleryImg(idx >= 0 ? idx : 0);
            if (pureModal) {
              pureModal.classList.add("is-open");
              document.body.style.overflow = "hidden";
            }
          });
        });

        function closePureModal() {
          if (!pureModal) return;
          pureModal.classList.remove("is-open");
          document.body.style.overflow = "";
        }

        if (closePureBtn) closePureBtn.addEventListener("click", closePureModal);
        if (prevPureBtn) {
          prevPureBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showGalleryImg(currentGalleryIdx - 1);
          });
        }
        if (nextPureBtn) {
          nextPureBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showGalleryImg(currentGalleryIdx + 1);
          });
        }
        if (pureModal) {
          pureModal.addEventListener("click", (e) => {
            if (e.target === pureModal) closePureModal();
          });
        }

        /* 13. FLOATING WHATSAPP CHAT WIDGET */
        const waChatBtn = document.getElementById("whatsappChatBtn");
        const waChatBox = document.getElementById("whatsappChatBox");
        const closeWaChatBtn = document.getElementById("closeWhatsappChatBtn");
        const waChatForm = document.getElementById("whatsappChatForm");

        if (waChatBtn && waChatBox) {
          waChatBtn.addEventListener("click", () => {
            waChatBox.classList.toggle("is-open");
          });
        }
        if (closeWaChatBtn && waChatBox) {
          closeWaChatBtn.addEventListener("click", () => {
            waChatBox.classList.remove("is-open");
          });
        }

        if (waChatForm) {
          waChatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("waName") ? document.getElementById("waName").value.trim() : "";
            const service = document.getElementById("waService") ? document.getElementById("waService").value : "";
            const message = document.getElementById("waMessage") ? document.getElementById("waMessage").value.trim() : "";
            const formatted = `Hello G2 Royal Unisex Salon & Academy,
Name: ${name}
Inquiry: ${service}
Message: ${message}`;
            const waUrl = `https://wa.me/9779742931920?text=${encodeURIComponent(formatted)}`;
            window.open(waUrl, "_blank");
            waChatForm.reset();
            if (waChatBox) waChatBox.classList.remove("is-open");
          });
        }

        /* Global Keyboard Navigation (Arrows & Escape Key) */
        document.addEventListener("keydown", (e) => {
          if (pureModal && pureModal.classList.contains("is-open")) {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              showGalleryImg(currentGalleryIdx - 1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              showGalleryImg(currentGalleryIdx + 1);
            } else if (e.key === "Escape") {
              closePureModal();
            }
            return;
          }

          if (e.key === "Escape") {
            if (videoModal && !videoModal.classList.contains("hidden")) closeStoryModal();
            if (bookingModal && !bookingModal.classList.contains("hidden")) closeBookingModal();
            if (waChatBox && waChatBox.classList.contains("is-open")) waChatBox.classList.remove("is-open");
            if (conciergeDrawer && !conciergeDrawer.classList.contains("hidden")) {
              conciergeDrawer.classList.add("hidden");
              conciergeDrawer.classList.remove("flex");
            }
            if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
              mobileMenu.classList.add("hidden");
            }
          }
        });

        /* 10. BACK TO TOP FLOATING BUTTON */
        const backToTopBtn = document.getElementById("backToTopBtn");
        if (backToTopBtn) {
          window.addEventListener("scroll", () => {
            if (window.scrollY > 350) {
              backToTopBtn.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
              backToTopBtn.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
            } else {
              backToTopBtn.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
              backToTopBtn.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
            }
          });

          backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        }
        /* 11. TESTIMONIALS CAROUSEL (8 ITEMS) */
        function initTestimonialsCarousel() {
          const track = document.getElementById("testiTrack");
          const prevBtn = document.getElementById("testiPrevBtn");
          const nextBtn = document.getElementById("testiNextBtn");
          const dotsContainer = document.getElementById("testiDots");
          if (!track) return;

          const slides = track.querySelectorAll(".testi-slide");
          const totalSlides = slides.length;
          if (totalSlides === 0) return;

          let currentIndex = 0;

          function getVisibleSlides() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
          }

          function getMaxIndex() {
            return Math.max(0, totalSlides - getVisibleSlides());
          }

          function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = "";
            const maxIdx = getMaxIndex();
            for (let i = 0; i <= maxIdx; i++) {
              const dot = document.createElement("button");
              dot.className = `testi-dot ${i === currentIndex ? "is-active" : ""}`;
              dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
              dot.addEventListener("click", () => goToSlide(i));
              dotsContainer.appendChild(dot);
            }
          }

          function updateTrack() {
            const maxIdx = getMaxIndex();
            if (currentIndex > maxIdx) currentIndex = maxIdx;

            const slideWidth = slides[0].offsetWidth;
            const gap = 24;
            const moveAmount = currentIndex * (slideWidth + gap);
            track.style.transform = `translateX(-${moveAmount}px)`;

            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= maxIdx;

            if (dotsContainer) {
              const dots = dotsContainer.querySelectorAll(".testi-dot");
              dots.forEach((dot, idx) => {
                if (idx === currentIndex) dot.classList.add("is-active");
                else dot.classList.remove("is-active");
              });
            }
          }

          function goToSlide(index) {
            const maxIdx = getMaxIndex();
            currentIndex = Math.max(0, Math.min(maxIdx, index));
            updateTrack();
          }

          if (prevBtn) {
            prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
          }
          if (nextBtn) {
            nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));
          }

          // Touch swipe support
          let startX = 0;
          let isSwiping = false;

          track.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
          }, { passive: true });

          track.addEventListener("touchend", (e) => {
            if (!isSwiping) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 40) {
              if (diff > 0) goToSlide(currentIndex + 1);
              else goToSlide(currentIndex - 1);
            }
            isSwiping = false;
          });

          window.addEventListener("resize", () => {
            createDots();
            updateTrack();
          });

          createDots();
          updateTrack();
        }
        initTestimonialsCarousel();

        /* 12. PAGINATION HANDLERS FOR OTHER PAGES */
        function initPagePaginations() {
          const paginationContainers = document.querySelectorAll(".luxury-pagination");
          paginationContainers.forEach((pagination) => {
            const buttons = pagination.querySelectorAll(".page-num-btn");
            const prev = pagination.querySelector(".page-prev-btn");
            const next = pagination.querySelector(".page-next-btn");

            buttons.forEach((btn, idx) => {
              btn.addEventListener("click", (e) => {
                e.preventDefault();
                buttons.forEach(b => b.classList.remove("is-active"));
                btn.classList.add("is-active");
                if (prev) {
                  if (idx === 0) prev.classList.add("is-disabled");
                  else prev.classList.remove("is-disabled");
                }
                if (next) {
                  if (idx === buttons.length - 1) next.classList.add("is-disabled");
                  else next.classList.remove("is-disabled");
                }
                const section = pagination.closest("section");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              });
            });

            if (prev) {
              prev.addEventListener("click", (e) => {
                e.preventDefault();
                const active = pagination.querySelector(".page-num-btn.is-active");
                if (active && active.previousElementSibling && active.previousElementSibling.classList.contains("page-num-btn")) {
                  active.previousElementSibling.click();
                }
              });
            }

            if (next) {
              next.addEventListener("click", (e) => {
                e.preventDefault();
                const active = pagination.querySelector(".page-num-btn.is-active");
                if (active && active.nextElementSibling && active.nextElementSibling.classList.contains("page-num-btn")) {
                  active.nextElementSibling.click();
                }
              });
            }
          });
        }
        initPagePaginations();
      });

  /* THEME TOGGLE: light (default via <html data-theme="light">) <-> dark */
  (function () {
    const KEY = "g2-theme";
    const root = document.documentElement;
    const btn = document.getElementById("themeToggle");

    let stored = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch (e) {}

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    if (stored === "dark") {
      applyTheme("dark");
    } else if (stored === "light") {
      applyTheme("light");
    } else {
      const initial = root.getAttribute("data-theme") || "light";
      applyTheme(initial);
    }

    function syncToggle() {
      if (!btn) return;
      const isLight = root.getAttribute("data-theme") === "light";
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = isLight
          ? "fa-solid fa-moon text-xs"
          : "fa-solid fa-sun text-xs";
      }
      btn.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
      );
    }

    syncToggle();

    if (btn) {
      btn.addEventListener("click", () => {
        const isLight = root.getAttribute("data-theme") === "light";
        const nextTheme = isLight ? "dark" : "light";
        applyTheme(nextTheme);
        try {
          localStorage.setItem(KEY, nextTheme);
        } catch (e) {}
        syncToggle();
      });
    }
  })();

(function () {
  var root = document.documentElement;
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  function initLuxuryScrollReveals() {
    root.classList.add("reveal-ready");

    function applyStagger(elements) {
      if (!elements || !elements.length) return;
      Array.prototype.forEach.call(elements, function (el, i) {
        el.classList.add("reveal");
        var staggerIdx = (i % 8) + 1;
        el.classList.add("stagger-" + staggerIdx);
      });
    }

    // 1. All section heads
    var sectionHeads = document.querySelectorAll(".section-head");
    Array.prototype.forEach.call(sectionHeads, function (head) {
      head.classList.add("reveal");
    });

    // 2. Section backgrounds & ornaments
    var sections = document.querySelectorAll("section.section");
    Array.prototype.forEach.call(sections, function (sec) {
      sec.classList.add("section-observe");
    });

    // 3. Hero content (Left column, right collage, fact cards)
    var heroLeft = document.querySelector("#hero .lg\\:col-span-6:first-child");
    if (heroLeft) heroLeft.classList.add("reveal");

    var heroRight = document.querySelector("#hero .lg\\:col-span-6:last-child");
    if (heroRight) heroRight.classList.add("reveal-scale");

    var factCards = document.querySelectorAll("#hero .fact-card");
    applyStagger(factCards);

    // 4. Services (Filter bar + cards)
    var serviceFilters = document.querySelector("#services .overflow-x-auto");
    if (serviceFilters) serviceFilters.classList.add("reveal");
    var serviceCards = document.querySelectorAll("#services .service-card");
    applyStagger(serviceCards);

    // 5. Transformations (Before/After comparison cards)
    var transCards = document.querySelectorAll("#transformations .card");
    applyStagger(transCards);

    // 6. Transformation Videos (Reels carousel)
    var videoTrack = document.getElementById("videoCarouselTrack");
    if (videoTrack) {
      applyStagger(videoTrack.children);
    }

    // 7. Academy (3 Course Diplomas)
    var academyCards = document.querySelectorAll("#academy .card");
    applyStagger(academyCards);

    // 8. Admissions Desk (Admissions info left + Quick Apply card right)
    var admissionsLeft = document.querySelector("#admissions .lg\\:col-span-5");
    if (admissionsLeft) admissionsLeft.classList.add("reveal-left");
    var quickApplyCard = document.getElementById("quickApplyCard");
    if (quickApplyCard) quickApplyCard.classList.add("reveal-right");

    // 9. Career Journey (5 Phase milestone cards)
    var journeyCards = document.querySelectorAll("#journey .card");
    applyStagger(journeyCards);

    // 10. Infrastructure Zones
    var infraCards = document.querySelectorAll("#infrastructure .card");
    applyStagger(infraCards);

    // 11. Instructors (Faculty carousel)
    var instructorCards = document.querySelectorAll("#instructors .instructor-card");
    applyStagger(instructorCards);

    // 12. Testimonials / Voices
    var voiceCards = document.querySelectorAll("#voices .card");
    applyStagger(voiceCards);

    // 13. Studio Coordinates & Map Frame
    var mapFrame = document.querySelector("#studio .map-frame");
    if (mapFrame) mapFrame.classList.add("reveal-scale");

    // 14. Partner Brand Badges
    var partnerCards = document.querySelectorAll("#partners .card");
    applyStagger(partnerCards);

    // 15. Footer Columns
    var footerColumns = document.querySelectorAll("footer .grid > div");
    applyStagger(footerColumns);

    // Collect all targets
    var allTargets = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .section-observe"
    );

    if (!allTargets.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add("is-visible");
          io.unobserve(el);
          window.setTimeout(function () {
            el.classList.add("revealed-done");
          }, 1000);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    var vh = window.innerHeight || 800;
    Array.prototype.forEach.call(allTargets, function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.88) {
        window.setTimeout(function () {
          el.classList.add("is-visible");
        }, 60);
      } else {
        io.observe(el);
      }
    });

    // Safety fallback
    window.setTimeout(function () {
      Array.prototype.forEach.call(allTargets, function (el) {
        el.classList.add("is-visible");
      });
    }, 2800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLuxuryScrollReveals);
  } else {
    initLuxuryScrollReveals();
  }
})();

/* ==========================================================================
   REELS CAROUSEL
   ========================================================================== */
(function () {
  function initReelsCarousel() {
    const track = document.getElementById("reelsTrack");
    const prevBtn = document.getElementById("reelsPrev");
    const nextBtn = document.getElementById("reelsNext");
    const dots = document.querySelectorAll("[data-reel-dot]");
    if (!track || !prevBtn || !nextBtn) return;

    const slides = track.querySelectorAll(".reels-carousel-slide");
    const total = slides.length;
    let current = 0;

    function getSlidesVisible() {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 600) return 2;
      return 1;
    }

    function getSlideWidthPercent() {
      const vis = getSlidesVisible();
      // Each slide: calc(100% / vis) with gap accounted
      // Use the actual rendered slide width relative to track width
      const outer = track.parentElement;
      if (!outer) return 100 / vis;
      const outerW = outer.offsetWidth;
      const gapPx = 20; // 1.25rem ~ 20px
      const slideW = (outerW - gapPx * (vis - 1)) / vis;
      return (slideW / outerW) * 100;
    }

    function goTo(index) {
      const vis = getSlidesVisible();
      const maxIndex = Math.max(0, total - vis);
      current = Math.max(0, Math.min(index, maxIndex));

      const outer = track.parentElement;
      const outerW = outer ? outer.offsetWidth : 0;
      const gapPx = 20;
      const vis2 = getSlidesVisible();
      const slideW = (outerW - gapPx * (vis2 - 1)) / vis2;
      const offset = current * (slideW + gapPx);
      track.style.transform = "translateX(-" + offset + "px)";

      // Update dots
      dots.forEach(function (d) {
        d.classList.toggle("is-active", parseInt(d.dataset.reelDot) === current);
      });

      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= maxIndex;
    }

    prevBtn.addEventListener("click", function () { goTo(current - 1); });
    nextBtn.addEventListener("click", function () { goTo(current + 1); });
    dots.forEach(function (d) {
      d.addEventListener("click", function () { goTo(parseInt(d.dataset.reelDot)); });
    });

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    window.addEventListener("resize", function () { goTo(current); });
    goTo(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReelsCarousel);
  } else {
    initReelsCarousel();
  }
})();