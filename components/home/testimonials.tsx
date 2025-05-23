export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content: "The quality of products is exceptional. Discreet packaging and fast shipping made the experience even better.",
      author: "Sara M.",
      location: "New York",
      rating: 5,
    },
    {
      id: 2,
      content: "Great selection and the customer service is outstanding. They answered all my questions promptly.",
      author: "James T.",
      location: "Los Angeles",
      rating: 5,
    },
    {
      id: 3,
      content: "Luxe Intimates has the best quality lingerie I've ever purchased. The materials are superb.",
      author: "Emma L.",
      location: "Chicago",
      rating: 4,
    },
  ];

  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Read genuine reviews from our satisfied customers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-card p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-card-foreground mb-4 italic">"{testimonial.content}"</p>
              <div className="text-sm">
                <span className="font-medium">{testimonial.author}</span>
                <span className="text-muted-foreground"> • {testimonial.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}