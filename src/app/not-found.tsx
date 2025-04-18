import { NotFound404 } from '~/components/common/404'
import { StyledButton } from '~/components/ui/button'
import { sansFont } from '~/lib/fonts'

export default () => {
  return (
    <html>
      <body className={`${sansFont.variable} m-0 h-full p-0 font-sans`}>
        <div data-theme>
          <NotFound404>
            <StyledButton>
              <a href="/">Back to Home</a>
            </StyledButton>
          </NotFound404>
        </div>
      </body>
    </html>
  )
}
