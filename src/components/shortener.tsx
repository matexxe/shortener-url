import { useState } from "react";
import { Check, Copy, ExternalLink, LinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function LinkShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setShowSuccess(false);
    setError("");

    try {
      // Asegúrate de poner la ruta correcta con el endpoint '/api/shorten'
      const response = await fetch(
        "https://acortador-url-59fq.onrender.com/api/shorten",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ originalUrl: url }),
        }
      );

      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to shorten URL");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      setShowSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openShortUrl = () => {
    if (!shortUrl) return;
    window.open(shortUrl, "_blank");
  };

  return (
    <TooltipProvider>
      <Card className="border-2 border-gray-800 bg-gray-900">
        <CardHeader className="bg-gray-800 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-white">
            <LinkIcon className="h-5 w-5" />
            Acortador URL
          </CardTitle>
          <CardDescription className="text-gray-300">
            Ingresa una URL larga para crear un enlace más corto y fácil de
            manejar.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label
                htmlFor="url"
                className="text-sm font-medium text-gray-200"
              >
                URL a acortar:
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="focus-visible:ring-gray-500 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {error && (
              <Alert className="bg-red-900 text-red-100 border-red-800">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {showSuccess && (
              <Alert className="bg-green-900 text-green-100 border-green-800">
                <AlertDescription className="text-sm">
                  ¡URL acortada con éxito! Puedes copiarla abajo
                </AlertDescription>
              </Alert>
            )}

            {shortUrl && (
              <div className="space-y-3 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <Label
                  htmlFor="shortUrl"
                  className="text-sm font-medium flex items-center gap-2 text-gray-200"
                >
                  URL acortada:
                  {copied && (
                    <span className="text-xs text-green-400 font-normal">
                      (Copiado!)
                    </span>
                  )}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="shortUrl"
                    value={shortUrl}
                    readOnly
                    className="bg-gray-700 border-gray-600 font-medium text-white"
                    onClick={copyToClipboard}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={copyToClipboard}
                        className="flex-shrink-0 border-gray-600 hover:bg-gray-700 text-gray-200"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-white">
                      <p>Copiar</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={openShortUrl}
                        className="flex-shrink-0 border-gray-600 hover:bg-gray-700 text-gray-200"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-white">
                      <p>Abrir link</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-gray-400">
                  Haz clic en la URL o en el botón de copiar para copiar al
                  portapapeles.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-800 rounded-b-lg">
            <Button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Acortando..." : "Acortar URL"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TooltipProvider>
  );
}
