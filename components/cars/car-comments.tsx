"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  content: string;
  rating: number;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
}

interface CarCommentsProps {
  carId: string;
  initialComments: Comment[];
}

export function CarComments({ carId, initialComments }: CarCommentsProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour laisser un commentaire",
        variant: "destructive",
      });
      return;
    }
    
    if (newComment.trim() === "") {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/cars/${carId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          rating,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du commentaire");
      }
      
      const data = await response.json();
      
      setComments([...comments, data]);
      setNewComment("");
      setRating(5);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du commentaire",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Avis clients</h2>
      
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-muted/20 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{comment.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString('fr-BE')}
                  </p>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={i < comment.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      className={i < comment.rating ? "text-yellow-500" : "text-gray-300"}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
      )}
      
      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-lg p-4">
          <h3 className="font-semibold">Laisser un avis</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Note</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={i < rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={i < rating ? "text-yellow-500" : "text-gray-300"}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Commentaire
            </label>
            <textarea
              id="comment"
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Partagez votre expérience..."
              required
            ></textarea>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Publier l'avis"}
          </Button>
        </form>
      ) : (
        <div className="bg-muted/20 p-4 rounded-lg text-center">
          <p className="mb-2">Connectez-vous pour laisser un avis</p>
          <Button asChild>
            <a href="/auth/login">Se connecter</a>
          </Button>
        </div>
      )}
    </div>
  );
}
