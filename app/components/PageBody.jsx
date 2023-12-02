import SectionBuilder from '@/components/SectionBuilder'

const PageBody = ({ children, withoutLayout = false, loading, error, empty }) => {
  return (
    <div className='relative -top-12'>
      {withoutLayout ? (
        <div>{children}</div>
      ) : (
        <SectionBuilder loading={loading} error={error} empty={empty}>
          {children}
        </SectionBuilder>
      )}
    </div>
  )
}

export default PageBody
